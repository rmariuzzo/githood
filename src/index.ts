import parseArgv from 'yargs-parser'

import { githood } from './githood'
import { errors } from './errors'

const { _: args, help, debug, org, list, count } = parseArgv(
  process.argv.slice(2)
)

const nothingToDo = args.length === 0 && !list && !count

/* prettier-ignore */
if (help || nothingToDo) {
  console.info(`githood`)
  console.info(`Usage: githood [command] [...args]`)
  console.info(`Options:`)
  console.info(`  --org        Run commands in repos belonging to a GitHub org.`)
  console.info(`  --list       List all git repos.`)
  console.info(`  --count      Count all git repos.`)
  console.info(`  --help       Show this help message.`)
  console.info(`  --debug      Display debug information.`)
  process.exit(0)
}

githood({
  command: args ?? [],
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
    console.error(error.message ?? error)
    process.exit(errors.unhandled.code)
  })
