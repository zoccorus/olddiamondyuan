"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs = require("mz/fs");
const globby_1 = require("globby");
const config_1 = require("./config");
const vscode = require("vscode");
const JS_EXT_NAMES = ['.js', '.jsx', '.ts', '.tsx'];
function getModels(cwd) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const extName of JS_EXT_NAMES) {
            const absFilePath = path_1.join(cwd, `model${extName}`);
            if (yield fs.exists(absFilePath)) {
                return [absFilePath];
            }
        }
        const modules = (yield globby_1.default(['./models/**/*.{ts,tsx,js,jsx}'], {
            cwd,
            deep: true,
        })).filter(p => ['.d.ts', '.test.js', '.test.jsx', '.test.ts', '.test.tsx'].every(ext => !p.endsWith(ext)));
        return modules.map(p => path_1.join(cwd, p));
    });
}
exports.getModels = getModels;
/**
 * 参考了 umi 的源码
 * @see https://github.com/umijs/umi/blob/master/packages/umi-plugin-dva/src/index.js
 * @param filePath 文件路径
 * @param projectPath 项目路径
 */
function getPageModels(filePath, projectPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let models = [];
        let cwd = path_1.dirname(filePath);
        while (cwd !== projectPath && cwd !== path_1.join(projectPath, 'src')) {
            models = models.concat(yield getModels(cwd));
            cwd = path_1.dirname(cwd);
        }
        return models;
    });
}
exports.getPageModels = getPageModels;
function quoteString(input, type) {
    const quote = config_1.QuoteCharMap[type];
    return `${quote}${input}${quote}`;
}
exports.quoteString = quoteString;
function getAbsPath(input) {
    const rootPath = path_1.resolve(__dirname, '../../');
    return input.replace(path_1.join(rootPath, 'out'), path_1.join(rootPath, 'src'));
}
exports.getAbsPath = getAbsPath;
function getProjectPath(document) {
    if (!document || !document.uri) {
        return;
    }
    const filePath = document.uri.fsPath;
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return;
    }
    const workspace = workspaceFolders.find(workspaceFolder => {
        const { uri } = workspaceFolder;
        if (!uri || !uri.fsPath) {
            return false;
        }
        return filePath.startsWith(uri.fsPath);
    });
    if (!workspace) {
        return;
    }
    return workspace.uri.fsPath;
}
exports.getProjectPath = getProjectPath;
//# sourceMappingURL=utils.js.map