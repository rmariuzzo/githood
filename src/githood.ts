import { findGitRepos } from './find-git-repos'
import { runInGitRepos } from './run-in-git-repos'

type Options = {
  command: string[]
  name: string
  remoteName: string
  org: string
  list: boolean
  count: boolean
  cwd: string
  debug: boolean
}

export const githood = async (options: Options) => {
  const gitRepos = await findGitRepos({
    cwd: options.cwd,
    filterByGithubUsername: options.org,
    filterByGithubRepoName: options.remoteName,
    filterByRepoName: options.name
  })

  if (options.list) {
    gitRepos.forEach((gitRepo) => {
      console.log(gitRepo.name)
    })
  }

  if (options.count) {
    console.log(gitRepos.length)
  }

  if (options.command.length > 0) {
    await runInGitRepos(
      options.command,
      gitRepos.map((gitRepo) => gitRepo.path)
    )
  }
}
