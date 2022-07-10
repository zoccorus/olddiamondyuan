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
const types_1 = require("./../common/types");
const logger_1 = require("./../common/logger");
const vscode_1 = require("vscode");
const globby_1 = require("globby");
const lodash_1 = require("lodash");
const typedi_1 = require("typedi");
const vscodeService_1 = require("./vscodeService");
const modelReferenceParser_1 = require("./parser/modelReferenceParser");
const path_1 = require("path");
const modelInfoService_1 = require("./modelInfoService");
exports.ModelReferenceServiceToken = new typedi_1.Token();
let ModelReferenceService = class ModelReferenceService {
    constructor(logger, vscodeService, modelInfoService, modelReferenceParser) {
        this.vscodeService = vscodeService;
        this.logger = logger;
        this.modelReferenceMap = new Map();
        this.projectFileModelsMap = new Map();
        this.modelInfoService = modelInfoService;
        this.modelReferenceParser = modelReferenceParser;
    }
    getReference(filePath, model, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectPath = this.vscodeService.getProjectPath(filePath);
            if (!projectPath) {
                return [];
            }
            if (!this.modelReferenceMap.has(projectPath)) {
                yield this.loadProject(projectPath);
            }
            return lodash_1.flatten(Object.values(this.getActionReference(projectPath, model, action)));
        });
    }
    reloadFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectPath = this.vscodeService.getProjectPath(filePath);
            if (!projectPath) {
                return;
            }
            let fileModels = this.projectFileModelsMap.get(projectPath);
            if (!fileModels) {
                fileModels = {};
                this.projectFileModelsMap.set(projectPath, fileModels);
            }
            const previousFileModels = fileModels[filePath];
            if (previousFileModels && previousFileModels.length > 0) {
                previousFileModels.forEach(({ namespace, action }) => {
                    this.getActionReference(projectPath, namespace, action)[filePath] = [];
                });
            }
            const modelReferences = yield this.modelReferenceParser.parseFile(filePath);
            const currentNameSpace = yield this.modelInfoService.getNameSpace(filePath);
            let actions = [];
            modelReferences.forEach(({ uri, range, type }) => {
                let namespace;
                let action;
                if (type.includes('/')) {
                    [namespace, action] = type.split('/');
                }
                else {
                    [namespace, action] = [currentNameSpace, type];
                }
                actions.push({
                    namespace,
                    action,
                });
                const reference = this.getActionReference(projectPath, namespace, action)[filePath] || [];
                reference.push(new vscode_1.Location(uri, range));
                this.getActionReference(projectPath, namespace, action)[filePath] = reference;
            });
            fileModels[filePath] = actions;
        });
    }
    loadProject(cwd) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = (yield globby_1.default([`./src/**/*{${types_1.JS_EXT_NAMES.join(',')}}`, '!./node_modules/**'], {
                cwd,
                deep: true,
            })).filter(p => ['.d.ts', '.test.js', '.test.jsx', '.test.ts', '.test.tsx'].every(ext => !p.endsWith(ext)));
            this.logger.info(`load project ${cwd} find ${files.length} files`);
            yield Promise.all(files.map(file => this.reloadFile(path_1.join(cwd, file))));
            this.logger.info(`load project ${cwd} success`);
        });
    }
    getActionReference(projectPath, namespace, action) {
        let project = this.modelReferenceMap.get(projectPath);
        if (!project) {
            project = {};
            this.modelReferenceMap.set(projectPath, project);
        }
        let modelReference;
        if (!project[namespace]) {
            project[namespace] = {};
        }
        modelReference = project[namespace];
        if (!modelReference[action]) {
            modelReference[action] = {};
        }
        return modelReference[action];
    }
};
ModelReferenceService = __decorate([
    typedi_1.Service(exports.ModelReferenceServiceToken),
    __param(0, typedi_1.Inject(logger_1.LoggerService)),
    __param(1, typedi_1.Inject(vscodeService_1.VscodeServiceToken)),
    __param(2, typedi_1.Inject(modelInfoService_1.ModelInfoServiceToken)),
    __param(3, typedi_1.Inject(modelReferenceParser_1.ModelReferenceParserToken)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ModelReferenceService);
exports.default = ModelReferenceService;
//# sourceMappingURL=modelReferenceService.js.map