"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findGitRepos = void 0;
var fs_1 = __importDefault(require("fs"));
var ini_1 = __importDefault(require("ini"));
var path_1 = __importDefault(require("path"));
var util_1 = require("util");
var preadDir = util_1.promisify(fs_1.default.readdir);
var pstat = util_1.promisify(fs_1.default.stat);
var preadFile = util_1.promisify(fs_1.default.readFile);
var githubRemoteUrlMatcher = /[/@]github\.com[/:](?<username>[^/]+)\/(?<repository>.+)\.git/;
var regularExpressionMatcher = /^\/(?<expression>.+)\//;
var findGitRepos = function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var entries, entryDescs, gitRepos, filteredGitReposByGithubUsername, filteredGitReposByGithubRepoName, filteredGitReposByName;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, preadDir(options.cwd)];
            case 1:
                entries = _a.sent();
                return [4 /*yield*/, Promise.all(entries.map(function (entry) {
                        var repoPath = path_1.default.join(options.cwd, entry);
                        var repoGitPath = path_1.default.join(repoPath, '.git', 'config');
                        return (function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a, _b;
                            var _c;
                            var _d, _e, _f;
                            return __generator(this, function (_g) {
                                switch (_g.label) {
                                    case 0:
                                        _c = {
                                            name: entry,
                                            path: repoPath
                                        };
                                        return [4 /*yield*/, pstat(repoGitPath).catch(function () { return null; })];
                                    case 1:
                                        _c.hasGitConfig = (_d = (_g.sent())) === null || _d === void 0 ? void 0 : _d.isFile;
                                        _b = (_a = ini_1.default).parse;
                                        return [4 /*yield*/, preadFile(repoGitPath).catch(function () { return null; })];
                                    case 2: return [2 /*return*/, (_c.gitConfig = _b.apply(_a, [(_f = (_e = (_g.sent())) === null || _e === void 0 ? void 0 : _e.toString()) !== null && _f !== void 0 ? _f : '']),
                                            _c)];
                                }
                            });
                        }); })();
                    }))];
            case 2:
                entryDescs = _a.sent();
                gitRepos = entryDescs.filter(function (desc) { return desc.hasGitConfig; });
                filteredGitReposByGithubUsername = options.filterByGithubUsername
                    ? gitRepos.filter(function (gitRepo) {
                        var _a, _b, _c, _d, _e, _f, _g, _h;
                        var filter = (_a = options.filterByGithubUsername) !== null && _a !== void 0 ? _a : '';
                        var url = ((_c = (_b = gitRepo.gitConfig['remote "origin"']) === null || _b === void 0 ? void 0 : _b.url) !== null && _c !== void 0 ? _c : '').toLowerCase();
                        var isGithubHosted = githubRemoteUrlMatcher.test(url);
                        var username = (_g = (_f = (_e = (_d = url.match(githubRemoteUrlMatcher)) === null || _d === void 0 ? void 0 : _d.groups) === null || _e === void 0 ? void 0 : _e.username) === null || _f === void 0 ? void 0 : _f.toLowerCase()) !== null && _g !== void 0 ? _g : '';
                        var useRegExp = filter.match(regularExpressionMatcher);
                        if ((_h = useRegExp === null || useRegExp === void 0 ? void 0 : useRegExp.groups) === null || _h === void 0 ? void 0 : _h.expression) {
                            return isGithubHosted && username.match(useRegExp.groups.expression);
                        }
                        return isGithubHosted && username === filter.toLowerCase();
                    })
                    : gitRepos;
                filteredGitReposByGithubRepoName = options.filterByGithubRepoName
                    ? filteredGitReposByGithubUsername.filter(function (gitRepo) {
                        var _a, _b, _c, _d, _e, _f, _g, _h;
                        var filter = (_a = options.filterByGithubRepoName) !== null && _a !== void 0 ? _a : '';
                        var url = ((_c = (_b = gitRepo.gitConfig['remote "origin"']) === null || _b === void 0 ? void 0 : _b.url) !== null && _c !== void 0 ? _c : '').toLowerCase();
                        var isGithubHosted = githubRemoteUrlMatcher.test(url);
                        var repository = (_g = (_f = (_e = (_d = url
                            .match(githubRemoteUrlMatcher)) === null || _d === void 0 ? void 0 : _d.groups) === null || _e === void 0 ? void 0 : _e.repository) === null || _f === void 0 ? void 0 : _f.toLowerCase()) !== null && _g !== void 0 ? _g : '';
                        var useRegExp = filter.match(regularExpressionMatcher);
                        if ((_h = useRegExp === null || useRegExp === void 0 ? void 0 : useRegExp.groups) === null || _h === void 0 ? void 0 : _h.expression) {
                            return isGithubHosted && repository.match(useRegExp.groups.expression);
                        }
                        return isGithubHosted && repository === filter.toLowerCase();
                    })
                    : filteredGitReposByGithubUsername;
                filteredGitReposByName = options.filterByRepoName
                    ? filteredGitReposByGithubRepoName.filter(function (gitRepo) {
                        var _a, _b;
                        var filter = (_a = options.filterByRepoName) !== null && _a !== void 0 ? _a : '';
                        var useRegExp = filter.match(regularExpressionMatcher);
                        return ((_b = useRegExp === null || useRegExp === void 0 ? void 0 : useRegExp.groups) === null || _b === void 0 ? void 0 : _b.expression) ? gitRepo.name.toLowerCase().match(useRegExp.groups.expression)
                            : gitRepo.name.toLowerCase().includes(filter.toLowerCase());
                    })
                    : filteredGitReposByGithubRepoName;
                return [2 /*return*/, filteredGitReposByName.map(function (desc) { return ({
                        name: desc.name,
                        path: desc.path
                    }); })];
        }
    });
}); };
exports.findGitRepos = findGitRepos;
