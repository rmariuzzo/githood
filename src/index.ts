import parseArgv from 'yargs-parser'

import { githood } from './githood'
import { errors } from './errors'

const { _: args, help, debug, name, remoteName, org, list, count } = parseArgv(
  process.argv.slice(2)
)

const nothingToDo = args.length === 0 && !list && !count

/* prettier-ignore */
if (help || nothingToDo) {
  console.info(`githood`)
  console.info(`Usage: githood [command] [...args]`)
  console.info(`Options:`)
  console.info(`  --name         Run commands in repos matching the given directory name.`)
  console.info(`                 Note: A regexp can be provided as '/expr/'.`)
  console.info(`  --remote-name  Run commands in repos matching the remote given name.`)
  console.info(`                 Note: A regexp can be provided as '/expr/'.`)
  console.info(`  --org          Run commands in repos belonging to a given GitHub org.`)
  console.info(`                 Note: A regexp can be provided as '/expr/'.`)
  console.info(`  --list         List all git repos.`)
  console.info(`  --count        Count all git repos.`)
  console.info(`  --help         Show this help message.`)
  console.info(`  --debug        Display debug information.`)
  process.exit(0)
}

githood({
  command: args ?? [],
  name,
  remoteName,
  org,
  list: Boolean(list),
  count: Boolean(count),
  cwd: process.cwd(),
  debug: Boolean(debug)
})
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('githood:', errors.unhandled.description)
    console.error(error)
    process.exit(errors.unhandled.code)
  })
