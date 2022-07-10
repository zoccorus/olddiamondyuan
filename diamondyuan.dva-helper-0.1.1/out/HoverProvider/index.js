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
const utils_1 = require("./../common/utils");
const document_1 = require("./../common/document");
const config_1 = require("./../common/config");
const logger_1 = require("../common/logger");
const vscode = require("vscode");
class DvaHoverProvider {
    constructor(cache) {
        this.cache = cache;
    }
    provideHover(document, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectPath = utils_1.getProjectPath(document);
            if (!projectPath) {
                return;
            }
            const config = config_1.getConfig();
            const filePath = document.uri.fsPath;
            const textDocumentUtils = new document_1.TextDocumentUtils(document);
            let actionType = textDocumentUtils.getWordInQuote(position, config.quotes);
            if (!actionType) {
                return;
            }
            if (!actionType.includes('/')) {
                const namespace = this.cache.getCurrentNameSpace(filePath);
                if (!namespace) {
                    return;
                }
                actionType = `${namespace}/${actionType}`;
            }
            const models = yield this.cache.getModules(filePath, projectPath);
            const [actionNameSpace, actionFunctionName] = actionType.split('/');
            logger_1.default.info(`hover action ${actionType}`);
            for (let model of models) {
                if (model.namespace === actionNameSpace) {
                    let actionFunction = model.effects[actionFunctionName];
                    if (actionFunction) {
                        return new vscode.Hover({
                            language: 'typescript',
                            value: actionFunction.code,
                        });
                    }
                    actionFunction = model.reducers[actionFunctionName];
                    if (actionFunction) {
                        return new vscode.Hover({
                            language: 'typescript',
                            value: actionFunction.code,
                        });
                    }
                }
            }
        });
    }
}
exports.default = DvaHoverProvider;
//# sourceMappingURL=index.js.map