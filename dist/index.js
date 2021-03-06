"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs_parser_1 = __importDefault(require("yargs-parser"));
var githood_1 = require("./githood");
var errors_1 = require("./errors");
var _a = yargs_parser_1.default(process.argv.slice(2)), args = _a._, help = _a.help, debug = _a.debug, name = _a.name, remoteName = _a.remoteName, org = _a.org, list = _a.list, count = _a.count;
var nothingToDo = args.length === 0 && !list && !count;
/* prettier-ignore */
if (help || nothingToDo) {
    console.info("githood");
    console.info("Usage: githood [command] [...args]");
    console.info("Options:");
    console.info("  --name         Run commands in repos matching the given directory name.");
    console.info("                 Note: A regexp can be provided as '/expr/'.");
    console.info("  --remote-name  Run commands in repos matching the remote given name.");
    console.info("                 Note: A regexp can be provided as '/expr/'.");
    console.info("  --org          Run commands in repos belonging to a given GitHub org.");
    console.info("                 Note: A regexp can be provided as '/expr/'.");
    console.info("  --list         List all git repos.");
    console.info("  --count        Count all git repos.");
    console.info("  --help         Show this help message.");
    console.info("  --debug        Display debug information.");
    process.exit(0);
}
githood_1.githood({
    command: args !== null && args !== void 0 ? args : [],
    name: name,
    remoteName: remoteName,
    org: org,
    list: Boolean(list),
    count: Boolean(count),
    cwd: process.cwd(),
    debug: Boolean(debug)
})
    .then(function () {
    process.exit(0);
})
    .catch(function (error) {
    console.error('githood:', errors_1.errors.unhandled.description);
    console.error(error);
    process.exit(errors_1.errors.unhandled.code);
});
