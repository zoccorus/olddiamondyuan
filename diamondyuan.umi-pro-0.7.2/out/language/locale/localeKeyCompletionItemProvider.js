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
const localeService_1 = require("./../../services/localeService");
const vscodeService_1 = require("./../../services/vscodeService");
const vscode = require("vscode");
const utils_1 = require("../../common/utils");
const types_1 = require("../../common/types");
let LocaleKeyCompletionItemProvider = class LocaleKeyCompletionItemProvider {
    constructor(vscodeService, localeService) {
        this.vscodeService = vscodeService;
        this.localeService = localeService;
    }
    provideCompletionItems(document, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = document.uri.fsPath;
            const userConfig = this.vscodeService.getConfig(filePath);
            if (!userConfig) {
                return;
            }
            // 从当前点向前找50个字符
            const text = document.getText(new vscode.Range(document.positionAt(document.offsetAt(position) - 50), position));
            const linePrefix = document.lineAt(position).text.substr(0, position.character);
            if (!linePrefix.endsWith('id=') && !linePrefix.match(/id\s*:\s*$/)) {
                return [];
            }
            if (!text.includes('<FormattedMessage') &&
                !text.includes('formatMessage') &&
                !text.includes('<FormattedHTMLMessage') &&
                !text.includes('formatHTMLMessage')) {
                return [];
            }
            const keys = this.localeService.getKeys(filePath);
            const config = this.vscodeService.getConfig(filePath);
            let quoteType = config ? config.quotes : types_1.QuoteType.single;
            // use double quote while in component usage
            // TODO: better solution?
            if (text.includes('<FormattedMessage') || text.includes('<FormattedHTMLMessage')) {
                quoteType = types_1.QuoteType.double;
            }
            return keys.map(k => {
                return new vscode.CompletionItem(utils_1.quoteString(k, quoteType), vscode.CompletionItemKind.Value);
            });
        });
    }
};
LocaleKeyCompletionItemProvider = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject(vscodeService_1.VscodeServiceToken)),
    __param(1, typedi_1.Inject(localeService_1.LocaleServiceToken)),
    __metadata("design:paramtypes", [Object, Object])
], LocaleKeyCompletionItemProvider);
exports.LocaleKeyCompletionItemProvider = LocaleKeyCompletionItemProvider;
//# sourceMappingURL=localeKeyCompletionItemProvider.js.map