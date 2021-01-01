import chalk from 'chalk'
import execa from 'execa'

export const runInGitRepos = async (
  command: string[],
  gitRepoPaths: string[]
) => {
  const [file, ...args] = command
  for (const gitRepoPath of gitRepoPaths) {
    const result = await execa(file, args, { cwd: gitRepoPath })
    console.info(
      chalk.bgWhite.black(`${chalk.bold(gitRepoPath)}: ${command.join(' ')}`)
    )
    console.log(result.stdout)
  }
}
