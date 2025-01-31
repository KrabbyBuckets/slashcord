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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandler = void 0;
var fs_1 = require("fs");
var promises_1 = require("fs/promises");
var path_1 = require("path");
var CommandHandler = function (handler, dir, client, commands) { return __awaiter(void 0, void 0, void 0, function () {
    var path, files, _i, files_1, file, itemPath, stat, module_1, name_1, description, options;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                path = path_1.isAbsolute(dir) ? dir : path_1.join(require.main.path, dir);
                if (!fs_1.existsSync(path)) {
                    console.warn("Slashcord >> Cannot find directory \"" + dir + "\", please create one.");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, promises_1.readdir(path)];
            case 1:
                files = _a.sent();
                _i = 0, files_1 = files;
                _a.label = 2;
            case 2:
                if (!(_i < files_1.length)) return [3 /*break*/, 8];
                file = files_1[_i];
                itemPath = path_1.join(path, file);
                return [4 /*yield*/, promises_1.lstat(itemPath)];
            case 3:
                stat = _a.sent();
                if (!stat.isDirectory()) return [3 /*break*/, 5];
                return [4 /*yield*/, CommandHandler(handler, dir, client, commands)];
            case 4:
                _a.sent();
                return [3 /*break*/, 7];
            case 5:
                if (!file.endsWith(".js"))
                    return [2 /*return*/];
                module_1 = require(path_1.join(itemPath));
                name_1 = module_1.name, description = module_1.description, options = module_1.options;
                if (!name_1) {
                    console.warn("The file: \"" + file + "\" doesn't have a name, which is required for slash commands!");
                    return [3 /*break*/, 7];
                }
                commands.set(name_1, module_1);
                console.log("Slashcord >> Loaded the command: \"" + name_1 + "\"");
                //@ts-ignore
                return [4 /*yield*/, client.api.applications(client.user.id).commands.post({
                        data: {
                            name: name_1,
                            description: description,
                            options: options
                        }
                    })];
            case 6:
                //@ts-ignore
                _a.sent();
                _a.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 2];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.CommandHandler = CommandHandler;
//# sourceMappingURL=CommandHandler.js.map