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
const routerService_1 = require("./../../services/routerService");
const typedi_1 = require("typedi");
const vscodeService_1 = require("../../services/vscodeService");
const document_1 = require("../../common/document");
const path_1 = require("path");
const vscode = require("vscode");
const types_1 = require("../../common/types");
let UmiRouterCompletionItemProvider = class UmiRouterCompletionItemProvider {
    constructor(vscodeService, routerInfoService) {
        this.vscodeService = vscodeService;
        this.routerInfoService = routerInfoService;
    }
    provideCompletionItems(document, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = document.uri.fsPath;
            const textDocumentUtils = new document_1.TextDocumentUtils(document);
            const config = this.vscodeService.getConfig(filePath);
            const projectPath = this.vscodeService.getProjectPath(filePath);
            if (!projectPath || !config) {
                return;
            }
            const routerPath = config.routerConfigPath
                ? [config.routerConfigPath]
                : types_1.DEFAULT_ROUTER_CONFIG_PATH;
            if (routerPath.every(o => path_1.join(projectPath, o) !== document.uri.fsPath)) {
                return;
            }
            let range = textDocumentUtils.getQuoteRange(position, config.quotes);
            if (!range) {
                return;
            }
            let routePath = document.getText(range).slice(1, -1);
            const pages = yield this.routerInfoService.getAllPages(path_1.join(projectPath, 'src/pages', routePath));
            return pages.map(o => new vscode.CompletionItem(o));
        });
    }
};
UmiRouterCompletionItemProvider = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject(vscodeService_1.VscodeServiceToken)),
    __param(1, typedi_1.Inject(routerService_1.RouterInfoServiceToken)),
    __metadata("design:paramtypes", [Object, routerService_1.RouterInfoService])
], UmiRouterCompletionItemProvider);
exports.UmiRouterCompletionItemProvider = UmiRouterCompletionItemProvider;
//# sourceMappingURL=routerCompletionItemProvider.js.map