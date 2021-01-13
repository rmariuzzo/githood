import chalk from 'chalk'
import execa from 'execa'

export const runInGitRepos = async (
  command: string[],
  gitRepoPaths: string[]
) => {
  const [file, ...args] = command
  for (const gitRepoPath of gitRepoPaths) {
    console.info(chalk.bgYellow.black(`${gitRepoPath}: ${command.join(' ')}`))
    const result = execa(file, args, { cwd: gitRepoPath })
    result.stdout?.pipe(process.stdout)
    result.stderr?.pipe(process.stderr)
    await result
  }
}
