"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const modelInfoService_1 = require("./../../services/modelInfoService");
const vscodeService_1 = require("./../../services/vscodeService");
const vscode = require("vscode");
const utils_1 = require("../../common/utils");
const logger_1 = require("../../common/logger");
let ActionTypeCompletionItemProvider = class ActionTypeCompletionItemProvider {
    constructor(vscodeService, modelInfoService) {
        this.vscodeService = vscodeService;
        this.modelInfoService = modelInfoService;
    }
    provideCompletionItems(document, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = document.uri.fsPath;
            const userConfig = this.vscodeService.getConfig(filePath);
            if (!userConfig) {
                return;
            }
            const lineText = document.getText(new vscode.Range(position.with(position.line, 0), position));
            logger_1.default.info(`current line ${lineText}`);
            //todo 更智能的判断
            if (!lineText.includes('type')) {
                return [];
            }
            let dvaModels = yield this.modelInfoService.getModules(filePath);
            const currentNamespace = yield this.modelInfoService.getNameSpace(filePath);
            const completionItems = [];
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
};
ActionTypeCompletionItemProvider = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject(vscodeService_1.VscodeServiceToken)),
    __param(1, typedi_1.Inject(modelInfoService_1.ModelInfoServiceToken)),
    __metadata("design:paramtypes", [Object, Object])
], ActionTypeCompletionItemProvider);
exports.ActionTypeCompletionItemProvider = ActionTypeCompletionItemProvider;
//# sourceMappingURL=actionTypeCompletionItemProvider.js.map