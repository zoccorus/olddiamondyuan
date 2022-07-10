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
const modelEffectsParser_1 = require("./../../services/parser/modelEffectsParser");
const vscode_1 = require("vscode");
const vscodeService_1 = require("../../services/vscodeService");
let ModelEffectsGenerator = class ModelEffectsGenerator {
    constructor(modelEffectsParser, vscodeService) {
        this.disposables = [];
        this.handleDocumentSave = (document) => __awaiter(this, void 0, void 0, function* () {
            const { activeTextEditor } = vscode_1.window;
            if (!activeTextEditor || activeTextEditor.document !== document) {
                return;
            }
            const config = this.vscodeService.getConfig(document.uri.fsPath);
            if (!config || !config.autoGenerateSagaEffectsCommands) {
                return;
            }
            try {
                const codeToChange = yield this.modelEffectsParser.parseFile(document.uri.fsPath);
                if (codeToChange.length > 0) {
                    activeTextEditor.edit(editBuilder => {
                        codeToChange.forEach(({ range, code }) => {
                            editBuilder.replace(range, code);
                        });
                        setTimeout(() => {
                            document.save();
                        }, config.saveOnGenerateEffectsCommandTimeout);
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
        this.modelEffectsParser = modelEffectsParser;
        this.vscodeService = vscodeService;
        this.disposables.push(vscode_1.workspace.onDidSaveTextDocument(this.handleDocumentSave));
    }
    dispose() {
        this.disposables.forEach(d => d.dispose());
    }
};
ModelEffectsGenerator = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject(modelEffectsParser_1.ModelEffectsParserToken)),
    __param(1, typedi_1.Inject(vscodeService_1.VscodeServiceToken)),
    __metadata("design:paramtypes", [Object, Object])
], ModelEffectsGenerator);
exports.ModelEffectsGenerator = ModelEffectsGenerator;
//# sourceMappingURL=modelEffectsGenerator.js.map