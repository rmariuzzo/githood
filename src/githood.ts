import { findGitRepos } from './find-git-repos'

type Options = {
  org: string
  list: boolean
  count: boolean
  cwd: string
  debug: boolean
}

export const githood = async (options: Options) => {
  const gitRepos = await findGitRepos({
    cwd: options.cwd,
    filterByGithubUsername: options.org
  })

  if (options.list) {
    gitRepos.forEach((gitRepo) => {
      console.log(gitRepo.name)
    })
  }

  if (options.count) {
    console.log(gitRepos.length)
  }
}
