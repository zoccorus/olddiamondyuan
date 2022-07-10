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
const vscodeService_1 = require("../../services/vscodeService");
const modelInfoService_1 = require("../../services/modelInfoService");
const document_1 = require("../../common/document");
const logger_1 = require("../../common/logger");
const typedi_1 = require("typedi");
const vscode = require("vscode");
let ActionTypeHoverProvider = class ActionTypeHoverProvider {
    constructor(vscodeService, modelInfoService) {
        this.vscodeService = vscodeService;
        this.modelInfoService = modelInfoService;
    }
    provideHover(document, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = document.uri.fsPath;
            const config = this.vscodeService.getConfig(filePath);
            if (!config) {
                return;
            }
            const textDocumentUtils = new document_1.TextDocumentUtils(document);
            let range = textDocumentUtils.getQuoteRange(position, config.quotes);
            if (!range) {
                return;
            }
            let actionType = document.getText(range).slice(1, -1);
            if (!actionType.includes('/')) {
                const namespace = yield this.modelInfoService.getNameSpace(filePath);
                if (!namespace) {
                    return;
                }
                actionType = `${namespace}/${actionType}`;
            }
            const models = yield this.modelInfoService.getModules(filePath);
            const [actionNameSpace, actionFunctionName] = actionType.split('/');
            logger_1.default.info(`hover action ${actionType}`);
            for (let model of models) {
                if (model.namespace === actionNameSpace) {
                    let actionFunction = model.effects[actionFunctionName] || model.reducers[actionFunctionName];
                    if (actionFunction) {
                        return new vscode.Hover({
                            language: 'typescript',
                            value: actionFunction.code,
                        }, range);
                    }
                }
            }
        });
    }
};
ActionTypeHoverProvider = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject(vscodeService_1.VscodeServiceToken)),
    __param(1, typedi_1.Inject(modelInfoService_1.ModelInfoServiceToken)),
    __metadata("design:paramtypes", [Object, Object])
], ActionTypeHoverProvider);
exports.ActionTypeHoverProvider = ActionTypeHoverProvider;
//# sourceMappingURL=actionTypeHoverProvider.js.map