"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const completionItem_1 = require("./completionItem");
const HoverProvider_1 = require("./HoverProvider");
const DefinitionProvider_1 = require("./DefinitionProvider");
const cache_1 = require("./common/cache");
function activate(context) {
    console.log('extension "dva-helper" is now active!');
    const watcher = vscode.workspace.createFileSystemWatcher('**/*', false, false, false);
    watcher.onDidChange(e => cache_1.default.reloadFile(e.fsPath));
    watcher.onDidCreate(e => cache_1.default.reloadFile(e.fsPath));
    watcher.onDidDelete(e => cache_1.default.reloadFile(e.fsPath));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(['javascript', 'typescript'], new completionItem_1.default(cache_1.default), ':'));
    context.subscriptions.push(vscode.languages.registerHoverProvider(['javascript', 'typescript'], new HoverProvider_1.default(cache_1.default)));
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(['javascript', 'typescript'], new DefinitionProvider_1.default(cache_1.default)));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map