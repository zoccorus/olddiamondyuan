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
const dvaModelParser_1 = require("./parser/dvaModelParser");
const vscodeService_1 = require("./vscodeService");
const logger_1 = require("./../common/logger");
const path_1 = require("path");
const lodash = require("lodash");
const typedi_1 = require("typedi");
const utils_1 = require("../common/utils");
exports.ModelInfoServiceToken = new typedi_1.Token();
let ModelInfoService = class ModelInfoService {
    constructor(logger, vscodeService, dvaModelParser) {
        this.getModules = (filePath) => __awaiter(this, void 0, void 0, function* () {
            try {
                const projectPath = this.vscodeService.getProjectPath(filePath);
                if (!projectPath) {
                    return [];
                }
                const globalModels = yield utils_1.getModels(path_1.join(projectPath, 'src'));
                const pageModels = yield utils_1.getPageModels(filePath, projectPath);
                const modelFiles = globalModels.concat(pageModels);
                return lodash.flatten((yield Promise.all(modelFiles.map(file => this.fileToModels(file)))).filter((o) => !!o));
            }
            catch (error) {
                this.logger.info(error.message);
                return [];
            }
        });
        this.getNameSpace = (filePath) => __awaiter(this, void 0, void 0, function* () {
            const dvaModels = yield this.parserFile(filePath);
            if (!dvaModels || dvaModels.length !== 1) {
                return null;
            }
            return dvaModels[0].namespace;
        });
        this.updateFile = (filePath) => __awaiter(this, void 0, void 0, function* () {
            this.data[filePath] = null;
        });
        this.fileToModels = (filePath) => __awaiter(this, void 0, void 0, function* () {
            const models = yield this.parserFile(filePath);
            return models ? models.map(model => (Object.assign({}, model, { filePath }))) : null;
        });
        this.parserFile = (filePath) => __awaiter(this, void 0, void 0, function* () {
            const value = this.data[filePath];
            if (!value) {
                try {
                    this.data[filePath] = yield this.parser.parseFile(filePath);
                }
                catch (error) {
                    this.logger.info(`解析文件失败 ${filePath}`);
                    this.logger.info(error.message);
                }
            }
            return this.data[filePath];
        });
        this.logger = logger;
        this.logger.info('create ModelInfoService');
        this.vscodeService = vscodeService;
        this.data = {};
        this.parser = dvaModelParser;
    }
};
ModelInfoService = __decorate([
    typedi_1.Service(exports.ModelInfoServiceToken),
    __param(0, typedi_1.Inject(logger_1.LoggerService)),
    __param(1, typedi_1.Inject(vscodeService_1.VscodeServiceToken)),
    __param(2, typedi_1.Inject(dvaModelParser_1.DvaModelParserToken)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ModelInfoService);
exports.ModelInfoService = ModelInfoService;
//# sourceMappingURL=modelInfoService.js.map