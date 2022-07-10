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
const localeService_1 = require("../../services/localeService");
const vscodeService_1 = require("../../services/vscodeService");
const vscode = require("vscode");
const document_1 = require("../../common/document");
const types_1 = require("../../common/types");
let LocaleDefinitionProvider = class LocaleDefinitionProvider {
    constructor(vscodeService, localeService) {
        this.vscodeService = vscodeService;
        this.localeService = localeService;
    }
    provideDefinition(document, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = document.uri.fsPath;
            const textDocumentUtils = new document_1.TextDocumentUtils(document);
            const config = this.vscodeService.getConfig(filePath);
            const localeFile = this.localeService.getValidLocaleFile(filePath);
            if (!config || !localeFile) {
                return;
            }
            const text = document.getText(new vscode.Range(document.positionAt(document.offsetAt(position) - 50), position));
            let quoteType = config ? config.quotes : types_1.QuoteType.single;
            // use double quote while in component usage
            // TODO: better solution?
            if (text.includes('<FormattedMessage') || text.includes('<FormattedHTMLMessage')) {
                quoteType = types_1.QuoteType.double;
            }
            const range = textDocumentUtils.getQuoteRange(position, quoteType);
            if (!range) {
                return;
            }
            const localeKey = document.getText(range).slice(1, -1);
            const localeKeys = this.localeService.getKeys(filePath);
            if (!localeKeys.includes(localeKey)) {
                return;
            }
            const localeFileDoc = this.localeService.getLocaleAst(filePath);
            const keyAst = localeFileDoc.find(d => d.key === localeKey);
            if (!keyAst) {
                return;
            }
            return [
                {
                    originSelectionRange: range,
                    targetUri: keyAst.fileUri,
                    targetRange: keyAst.range,
                },
            ];
        });
    }
};
LocaleDefinitionProvider = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject(vscodeService_1.VscodeServiceToken)),
    __param(1, typedi_1.Inject(localeService_1.LocaleServiceToken)),
    __metadata("design:paramtypes", [Object, Object])
], LocaleDefinitionProvider);
exports.LocaleDefinitionProvider = LocaleDefinitionProvider;
//# sourceMappingURL=localeDefinitionProvider.js.map