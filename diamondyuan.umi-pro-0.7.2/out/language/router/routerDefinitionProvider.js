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
const types_1 = require("./../../common/types");
const vscodeService_1 = require("../../services/vscodeService");
const typedi_1 = require("typedi");
const vscode = require("vscode");
const document_1 = require("../../common/document");
const types_2 = require("../../common/types");
const path_1 = require("path");
const ast_1 = require("../../common/ast");
const fs = require("mz/fs");
let UmiRouterDefinitionProvider = class UmiRouterDefinitionProvider {
    constructor(vscodeService) {
        this.vscodeService = vscodeService;
    }
    provideDefinition(document, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = document.uri.fsPath;
            const textDocumentUtils = new document_1.TextDocumentUtils(document);
            const config = this.vscodeService.getConfig(filePath);
            if (!config) {
                return;
            }
            const projectPath = this.vscodeService.getProjectPath(filePath);
            if (!projectPath) {
                return;
            }
            const routerPath = config.routerConfigPath
                ? [config.routerConfigPath]
                : types_2.DEFAULT_ROUTER_CONFIG_PATH;
            if (routerPath.every(o => path_1.join(projectPath, o) !== document.uri.fsPath)) {
                return;
            }
            let range = textDocumentUtils.getQuoteRange(position, config.quotes);
            if (!range) {
                return;
            }
            let routePath = document.getText(range).slice(1, -1);
            const codeRange = textDocumentUtils.growBracketsRange(range, types_1.Brackets.CURLY);
            if (!codeRange) {
                return;
            }
            if (!ast_1.isPathInRouter(document.getText(codeRange), routePath, config.parserOptions)) {
                return;
            }
            const possiblePagePath = [
                '.js',
                '.jsx',
                '.ts',
                '.tsx',
                '/index.js',
                '/index.jsx',
                '/index.ts',
                '/index.tsx',
            ].map(prefix => path_1.join(projectPath, 'src/pages', `${routePath}${prefix}`));
            for (const pagePath of possiblePagePath) {
                if (yield fs.exists(pagePath)) {
                    return new vscode.Location(vscode.Uri.file(pagePath), new vscode.Position(0, 9));
                }
            }
        });
    }
};
UmiRouterDefinitionProvider = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject(vscodeService_1.VscodeServiceToken)),
    __metadata("design:paramtypes", [Object])
], UmiRouterDefinitionProvider);
exports.UmiRouterDefinitionProvider = UmiRouterDefinitionProvider;
//# sourceMappingURL=routerDefinitionProvider.js.map