import fs from 'fs'
import ini from 'ini'
import path from 'path'
import { promisify } from 'util'

const preadDir = promisify(fs.readdir)
const pstat = promisify(fs.stat)
const preadFile = promisify(fs.readFile)

const githubRemoteUrlMatcher = /[/@]github\.com[/:](?<username>[^/]+)\/(?<repository>.+)\.git/

type GitRepo = {
  name: string
  path: string
}

export const findGitRepos = async (options: {
  cwd: string
  filterByGithubUsername?: string
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
        const url = (
          (gitRepo.gitConfig['remote "origin"']?.url as string) ?? ''
        ).toLowerCase()
        const isGithubHosted = githubRemoteUrlMatcher.test(url)
        const username = url.match(githubRemoteUrlMatcher)?.groups?.username
        return (
          isGithubHosted &&
          username &&
          username === options.filterByGithubUsername
        )
      })
    : gitRepos

  const filteredGitReposByName = options.filterByRepoName
    ? filteredGitReposByGithubUsername.filter((gitRepo) => {
        const filter = options.filterByRepoName?.toLowerCase() ?? ''
        const useRegExp = filter.match(/^\/(?<expression>.+)\//)
        return useRegExp?.groups?.expression
          ? gitRepo.name.toLowerCase().match(useRegExp.groups.expression)
          : gitRepo.name.toLowerCase().includes(filter.toLowerCase())
      })
    : filteredGitReposByGithubUsername

  return filteredGitReposByName.map((desc) => ({
    name: desc.name,
    path: desc.path
  }))
}
