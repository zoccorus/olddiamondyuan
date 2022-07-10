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
const vscode = require("vscode");
const fs = require("mz/fs");
const logger_1 = require("./logger");
/**
 *
 * 检查项目是否安装了 umi 或者 dva
 *
 * @param projectPath 项目路径
 */
function needExtension(projectPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!projectPath) {
            return false;
        }
        const packageJsonPath = path_1.join(projectPath, './package.json');
        if (!(yield fs.exists(packageJsonPath))) {
            return false;
        }
        try {
            const packageJson = JSON.parse(yield fs.readFile(packageJsonPath, { encoding: 'utf-8' }));
            const { dependencies = {} } = packageJson;
            return !!(dependencies.umi ||
                dependencies.dva ||
                dependencies['dva-core'] ||
                dependencies.alita);
        }
        catch (error) {
            logger_1.default.info(error);
            return false;
        }
    });
}
function getUmiFileWatcher(workspaceFolders) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!workspaceFolders || workspaceFolders.length === 0) {
            return null;
        }
        const result = [];
        for (let workspaceFolder of workspaceFolders) {
            const { uri: { fsPath }, } = workspaceFolder;
            if (yield needExtension(fsPath)) {
                result.push(fsPath);
            }
        }
        if (result.length === 0) {
            return null;
        }
        logger_1.default.info(`watch ${result.length} project \n${result.join('\n')}`);
        const pattern = `{${result.join(',')}}/**/*.{ts,tsx,js,jsx}`;
        return vscode.workspace.createFileSystemWatcher(pattern, false, false, false);
    });
}
exports.getUmiFileWatcher = getUmiFileWatcher;
//# sourceMappingURL=fileWatcher.js.map