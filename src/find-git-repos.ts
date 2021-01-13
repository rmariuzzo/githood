import fs from 'fs'
import ini from 'ini'
import path from 'path'
import { promisify } from 'util'

const preadDir = promisify(fs.readdir)
const pstat = promisify(fs.stat)
const preadFile = promisify(fs.readFile)

const githubRemoteUrlMatcher = /[/@]github\.com[/:](?<username>[^/]+)\/(?<repository>.+)\.git/
const regularExpressionMatcher = /^\/(?<expression>.+)\//

type GitRepo = {
  name: string
  path: string
}

export const findGitRepos = async (options: {
  cwd: string
  filterByGithubUsername?: string
  filterByGithubRepoName?: string
  filterByRepoName?: string
}): Promise<GitRepo[]> => {
  const entries = await preadDir(options.cwd)

  const entryDescs = await Promise.all(
    entries.map((entry) => {
      const repoPath = path.join(options.cwd, entry)
      const repoGitPath = path.join(repoPath, '.git', 'config')
      return (async () => ({
        name: entry,
        path: repoPath,
        hasGitConfig: (await pstat(repoGitPath).catch(() => null))?.isFile,
        gitConfig: ini.parse(
          (await preadFile(repoGitPath).catch(() => null))?.toString() ?? ''
        )
      }))()
    })
  )

  const gitRepos = entryDescs.filter((desc) => desc.hasGitConfig)

  const filteredGitReposByGithubUsername = options.filterByGithubUsername
    ? gitRepos.filter((gitRepo) => {
        const filter = options.filterByGithubUsername ?? ''
        const url = (
          (gitRepo.gitConfig['remote "origin"']?.url as string) ?? ''
        ).toLowerCase()
        const isGithubHosted = githubRemoteUrlMatcher.test(url)
        const username =
          url.match(githubRemoteUrlMatcher)?.groups?.username?.toLowerCase() ??
          ''

        const useRegExp = filter.match(regularExpressionMatcher)
        if (useRegExp?.groups?.expression) {
          return isGithubHosted && username.match(useRegExp.groups.expression)
        }

        return isGithubHosted && username === filter.toLowerCase()
      })
    : gitRepos

  const filteredGitReposByGithubRepoName = options.filterByGithubRepoName
    ? filteredGitReposByGithubUsername.filter((gitRepo) => {
        const filter = options.filterByGithubRepoName ?? ''
        const url = (
          (gitRepo.gitConfig['remote "origin"']?.url as string) ?? ''
        ).toLowerCase()
        const isGithubHosted = githubRemoteUrlMatcher.test(url)
        const repository =
          url
            .match(githubRemoteUrlMatcher)
            ?.groups?.repository?.toLowerCase() ?? ''

        const useRegExp = filter.match(regularExpressionMatcher)
        if (useRegExp?.groups?.expression) {
          return isGithubHosted && repository.match(useRegExp.groups.expression)
        }

        return isGithubHosted && repository === filter.toLowerCase()
      })
    : filteredGitReposByGithubUsername

  const filteredGitReposByName = options.filterByRepoName
    ? filteredGitReposByGithubRepoName.filter((gitRepo) => {
        const filter = options.filterByRepoName ?? ''
        const useRegExp = filter.match(regularExpressionMatcher)
        return useRegExp?.groups?.expression
          ? gitRepo.name.toLowerCase().match(useRegExp.groups.expression)
          : gitRepo.name.toLowerCase().includes(filter.toLowerCase())
      })
    : filteredGitReposByGithubRepoName

  return filteredGitReposByName.map((desc) => ({
    name: desc.name,
    path: desc.path
  }))
}
