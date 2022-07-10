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
const modelReferenceService_1 = require("../../services/modelReferenceService");
const vscodeService_1 = require("../../services/vscodeService");
const typedi_1 = require("typedi");
const modelInfoService_1 = require("../../services/modelInfoService");
let ModelActionReference = class ModelActionReference {
    constructor(vscodeService, modelInfoService, modelReferenceService) {
        this.vscodeService = vscodeService;
        this.modelInfoService = modelInfoService;
        this.modelReferenceService = modelReferenceService;
    }
    provideReferences(document, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectPath = this.vscodeService.getProjectPath(document.uri.fsPath);
            if (!projectPath) {
                return;
            }
            const currentNamespace = yield this.modelInfoService.getNameSpace(document.uri.fsPath);
            if (!currentNamespace) {
                return;
            }
            const range = document.getWordRangeAtPosition(position);
            if (!range) {
                return;
            }
            return this.modelReferenceService.getReference(document.uri.fsPath, currentNamespace, document.getText(range));
        });
    }
};
ModelActionReference = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject(vscodeService_1.VscodeServiceToken)),
    __param(1, typedi_1.Inject(modelInfoService_1.ModelInfoServiceToken)),
    __param(2, typedi_1.Inject(modelReferenceService_1.ModelReferenceServiceToken)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ModelActionReference);
exports.ModelActionReference = ModelActionReference;
//# sourceMappingURL=modelActionReference.js.map