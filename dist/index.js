"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs_parser_1 = __importDefault(require("yargs-parser"));
var githood_1 = require("./githood");
var errors_1 = require("./errors");
var _a = yargs_parser_1.default(process.argv.slice(2)), help = _a.help, debug = _a.debug, org = _a.org, list = _a.list, count = _a.count;
/* prettier-ignore */
if (help) {
    console.info("githood");
    console.info("Usage: githood [git-sub-command]");
    console.info("Options:");
    console.info("  --org        Run commands in repos belonging to a GitHub org.");
    console.info("  --list       List all git repos.");
    console.info("  --count      Count all git repos.");
    console.info("  --help       Show this help message.");
    console.info("  --debug      Display debug information.");
    process.exit(0);
}
githood_1.githood({
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
    console.error('githood:', errors_1.errors.unhandled.code);
    console.error(error);
    process.exit(errors_1.errors.unhandled.code);
});
