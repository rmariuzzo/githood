# githood

Run commands in a group of git repos.

| ⚠️ This project is under development.
| -

## Installation

```shell
npm i githood --global
```

Optionally, you can run with: `npx githood`

## Usage

```shell
githood --help
```

Optionally, you can use it with: `npx githood --help`

## Example

#### Running a command across git repos

```shell
githood git status
```

#### Running a command across git repos in a GitHub org

```shell
githood git status --org rmariuzzo
```

## Options

### `--count`

Display the number of git repos.

### `--list`

Display all git repos.

### `--org`

Filter git repos by GitHub organization or username.

## Development

1.  Checkout the code.
2.  Install dependencies: `npm i`
3.  Watch and compile source: `npm run dev`
4.  Test compiled source: `./bin.js`

---

[MIT License](./LICENSE)

Author: [Rubens Mariuzzo](https://github.com/rmariuzzo)
