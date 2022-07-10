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
const vscode_1 = require("vscode");
const path_1 = require("path");
const utils_1 = require("../../common/utils");
const umircParser_1 = require("../../services/parser/umircParser");
const umircDef_1 = require("./umircDef");
let UmircDecoration = class UmircDecoration {
    constructor(umircParser) {
        this.lang = umircDef_1.getlang();
        this.annotationDecoration = vscode_1.window.createTextEditorDecorationType({});
        this.disposables = [];
        this.umircParser = umircParser;
        this.triggerUpdateDecorations();
        this.disposables.push(vscode_1.window.onDidChangeActiveTextEditor(this.triggerUpdateDecorations.bind(this)));
        this.disposables.push(vscode_1.workspace.onDidChangeTextDocument(() => this.triggerUpdateDecorations()));
    }
    dispose() {
        this.disposables.forEach(d => d.dispose());
    }
    triggerUpdateDecorations() {
        return __awaiter(this, void 0, void 0, function* () {
            let editor = vscode_1.window.activeTextEditor;
            if (!this.validUmirc(editor)) {
                return;
            }
            const { document } = editor;
            try {
                const umiProperties = yield this.umircParser.parseFile(document.fileName);
                const decorations = umiProperties
                    .map(p => {
                    if (!this.lang[p.key]) {
                        return null;
                    }
                    const decoration = {
                        renderOptions: {
                            after: {
                                color: new vscode_1.ThemeColor('umipro.annotationColor'),
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                                margin: '0',
                                contentText: ` \u22C5 ${this.lang[p.key]}`,
                            },
                        },
                        range: document.validateRange(new vscode_1.Range(p.loc.start.line - 1, Number.MAX_SAFE_INTEGER, p.loc.start.line - 1, Number.MAX_SAFE_INTEGER)),
                    };
                    return decoration;
                })
                    .filter(utils_1.isNotNull);
                editor.setDecorations(this.annotationDecoration, decorations);
            }
            catch (error) {
                console.warn('error', error);
            }
        });
    }
    validUmirc(editor) {
        if (!editor) {
            return false;
        }
        const { fileName } = editor.document;
        if (path_1.basename(fileName).includes('.umirc')) {
            return true;
        }
        return fileName.endsWith('config/config.js') || fileName.endsWith('config/config.ts');
    }
};
UmircDecoration = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject(umircParser_1.UmircParserToken)),
    __metadata("design:paramtypes", [Object])
], UmircDecoration);
exports.UmircDecoration = UmircDecoration;
//# sourceMappingURL=index.js.map