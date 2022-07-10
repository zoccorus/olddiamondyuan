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
const document_1 = require("../common/document");
const config_1 = require("./../common/config");
const utils_1 = require("../common/utils");
class DvaDefinitionProvider {
    constructor(cache) {
        this.cache = cache;
    }
    provideDefinition(document, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const textDocumentUtils = new document_1.TextDocumentUtils(document);
            const config = config_1.getConfig();
            const projectPath = utils_1.getProjectPath(document);
            if (!projectPath) {
                return;
            }
            let actionType = textDocumentUtils.getWordInQuote(position, config.quotes);
            if (!actionType) {
                return;
            }
            const filePath = document.uri.fsPath;
            if (!actionType.includes('/')) {
                const namespace = this.cache.getCurrentNameSpace(filePath);
                if (!namespace) {
                    return;
                }
                actionType = `${namespace}/${actionType}`;
            }
            const models = yield this.cache.getModules(filePath, projectPath);
            const [actionNameSpace, actionFunctionName] = actionType.split('/');
            for (let model of models) {
                if (model.namespace === actionNameSpace) {
                    let actionFunction = model.effects[actionFunctionName];
                    if (!actionFunction) {
                        actionFunction = model.reducers[actionFunctionName];
                    }
                    if (actionFunction) {
                        return new vscode.Location(vscode.Uri.file(model.filePath), new vscode.Position(actionFunction.loc.start.line - 1, actionFunction.loc.start.column));
                    }
                }
            }
        });
    }
}
exports.default = DvaDefinitionProvider;
//# sourceMappingURL=index.js.map