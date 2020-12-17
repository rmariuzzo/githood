#!/usr/bin/env node
/* eslint-disable */
try {
  // If ran with `npx` against the GitHub repo and dist files are not available
  // then it will fail.
  require('./dist')
} catch {
  console.error(
    "githood: can't be run right now, please try again in a few seconds..."
  )
  console.error(
    'githood: if the problem persist check: https://github.com/rmariuzzo/githood/actions'
  )
  process.exit(9)
}
