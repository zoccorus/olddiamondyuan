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
const vscode = require("vscode");
const config_1 = require("../common/config");
const utils_1 = require("../common/utils");
const logger_1 = require("../common/logger");
class DvaCompletionItemProvider {
    constructor(cache) {
        this.cache = cache;
    }
    provideCompletionItems(document, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const lineText = document.getText(new vscode.Range(position.with(position.line, 0), position));
            logger_1.default.info(`current line ${lineText}`);
            //todo 更智能的判断
            if (!lineText.includes('type')) {
                return [];
            }
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                return [];
            }
            const filePath = document.uri.fsPath;
            const workspace = workspaceFolders.find(o => filePath.startsWith(o.uri.fsPath));
            if (!workspace) {
                return [];
            }
            const projectPath = workspace.uri.fsPath;
            let dvaModels = yield this.cache.getModules(filePath, projectPath);
            const currentNamespace = this.cache.getCurrentNameSpace(filePath);
            const completionItems = [];
            const userConfig = config_1.getConfig();
            dvaModels.reduce((previousValue, currentValue) => {
                let namespace;
                if (currentValue.namespace === currentNamespace) {
                    namespace = '/';
                }
                else {
                    namespace = `${currentValue.namespace}/`;
                }
                Object.keys(currentValue.effects).forEach(key => {
                    const snippetCompletion = new vscode.CompletionItem(utils_1.quoteString(`${namespace}${key}`, userConfig.quotes));
                    snippetCompletion.documentation = new vscode.MarkdownString(`\`\`\`typescript\n${currentValue.effects[key].code}\`\`\``);
                    if (namespace === '/') {
                        snippetCompletion.insertText =
                            snippetCompletion.label[0] + snippetCompletion.label.slice(2);
                    }
                    previousValue.push(snippetCompletion);
                });
                Object.keys(currentValue.reducers).forEach(key => {
                    const snippetCompletion = new vscode.CompletionItem(utils_1.quoteString(`${namespace}${key}`, userConfig.quotes));
                    snippetCompletion.documentation = new vscode.MarkdownString(`\`\`\`typescript\n${currentValue.reducers[key].code}\`\`\``);
                    if (namespace === '/') {
                        snippetCompletion.insertText =
                            snippetCompletion.label[0] + snippetCompletion.label.slice(2);
                    }
                    previousValue.push(snippetCompletion);
                });
                return previousValue;
            }, completionItems);
            return completionItems;
        });
    }
}
exports.default = DvaCompletionItemProvider;
//# sourceMappingURL=index.js.map