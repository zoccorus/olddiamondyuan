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
const localeParser_1 = require("./parser/localeParser");
const vscodeService_1 = require("./vscodeService");
const logger_1 = require("./../common/logger");
const path_1 = require("path");
const fs_1 = require("fs");
const vscode = require("vscode");
const typedi_1 = require("typedi");
exports.LocaleServiceToken = new typedi_1.Token();
let LocaleService = class LocaleService {
    constructor(logger, vscodeService, localeParser) {
        this.getKeys = (filePath) => {
            const projectPath = this.vscodeService.getProjectPath(filePath);
            if (!projectPath) {
                return [];
            }
            return this.data[projectPath].map(r => r.key);
        };
        this.getLocaleAst = (filePath) => {
            const projectPath = this.vscodeService.getProjectPath(filePath);
            if (!projectPath) {
                return [];
            }
            return this.data[projectPath];
        };
        this.initLocales = () => __awaiter(this, void 0, void 0, function* () {
            const folders = vscode.workspace.workspaceFolders;
            if (!folders) {
                return;
            }
            folders
                .map(f => this.getValidLocaleFile(f.uri.fsPath))
                .filter((f) => !!f)
                .forEach((f) => __awaiter(this, void 0, void 0, function* () {
                yield this.updateFile(f);
            }));
        });
        /**
         * @param {string} filePath only changed while specfied locale file modified
         */
        this.updateFile = (filePath) => __awaiter(this, void 0, void 0, function* () {
            try {
                const localeFile = this.isValidLocaleFile(filePath);
                if (!localeFile) {
                    return;
                }
                const result = yield this.parser.parseFile(filePath);
                this.data[this.projectPath] = result;
            }
            catch (error) {
                this.logger.info(error.message);
            }
        });
        this.deleteFile = (filePath) => __awaiter(this, void 0, void 0, function* () {
            const localeFile = this.isValidLocaleFile(filePath);
            if (!localeFile) {
                return;
            }
            delete this.data[this.projectPath];
        });
        this.logger = logger;
        this.logger.info('create ModelInfoService');
        this.vscodeService = vscodeService;
        this.parser = localeParser;
        this.data = {};
        this.projectPath = '';
        this.config = null;
    }
    getValidLocaleFile(filePath) {
        return this.getLocaleFiles(filePath).find(l => fs_1.existsSync(l));
    }
    isValidLocaleFile(filePath) {
        return this.getLocaleFiles(filePath).some(f => filePath.endsWith(f));
    }
    getLocaleFiles(filePath) {
        const config = this.vscodeService.getConfig(filePath);
        const projectPath = this.vscodeService.getProjectPath(filePath);
        if (!config || !projectPath) {
            return [];
        }
        this.config = config;
        this.projectPath = projectPath;
        return [
            path_1.join(this.projectPath, 'src', 'locales', `${this.config.locale}.js`),
            path_1.join(this.projectPath, 'src', 'locales', `${this.config.locale}.ts`),
            path_1.join(this.projectPath, 'src', 'locale', `${this.config.locale}.js`),
            path_1.join(this.projectPath, 'src', 'locale', `${this.config.locale}.ts`),
        ];
    }
};
LocaleService = __decorate([
    typedi_1.Service(exports.LocaleServiceToken),
    __param(0, typedi_1.Inject(logger_1.LoggerService)),
    __param(1, typedi_1.Inject(vscodeService_1.VscodeServiceToken)),
    __param(2, typedi_1.Inject(localeParser_1.LocaleParserToken)),
    __metadata("design:paramtypes", [Object, Object, Object])
], LocaleService);
exports.LocaleService = LocaleService;
//# sourceMappingURL=localeService.js.map