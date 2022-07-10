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
const typedi_1 = require("typedi");
const vscode = require("vscode");
const lodash_1 = require("lodash");
const CONFIG_NAMESPACE = 'umi_pro';
/**
 *
 * Todo 消除重复的目录
 *
 * @param workspaceFolders 项目的目录
 *
 */
function eliminateSubWorkspaceFolder(workspaceFolders) {
    return workspaceFolders;
}
exports.eliminateSubWorkspaceFolder = eliminateSubWorkspaceFolder;
function getVscodeServiceArgs() {
    return __awaiter(this, void 0, void 0, function* () {
        const workspaceFolders = eliminateSubWorkspaceFolder(vscode.workspace.workspaceFolders);
        if (!workspaceFolders || workspaceFolders.length === 0) {
            return {
                workspaceFolders: null,
                workspaceConfigurations: null,
            };
        }
        const workspaceConfigurations = workspaceFolders.map(f => vscode.workspace.getConfiguration(CONFIG_NAMESPACE, f.uri));
        return { workspaceFolders, workspaceConfigurations };
    });
}
exports.getVscodeServiceArgs = getVscodeServiceArgs;
function loadVscodeService(service) {
    return __awaiter(this, void 0, void 0, function* () {
        const { workspaceFolders, workspaceConfigurations } = yield getVscodeServiceArgs();
        service.load(workspaceFolders, workspaceConfigurations);
    });
}
exports.loadVscodeService = loadVscodeService;
exports.VscodeServiceToken = new typedi_1.Token();
let VscodeService = class VscodeService {
    constructor() {
        this.workspaceFolders = [];
        this.workspaceConfigurations = [];
    }
    load(workspaceFolders, workspaceConfigurations) {
        if (!workspaceConfigurations || !workspaceFolders) {
            this.workspaceFolders = [];
            this.workspaceConfigurations = [];
            return;
        }
        this.workspaceFolders = workspaceFolders;
        this.workspaceConfigurations = workspaceConfigurations;
    }
    getConfig(filePath) {
        const index = this.workspaceFolders.findIndex(o => filePath.startsWith(o.uri.fsPath));
        if (index === -1) {
            return null;
        }
        const userConfig = this.workspaceConfigurations[index];
        const config = {
            quotes: types_1.QuoteType.single,
            routerConfigPath: userConfig.get('router_config_path'),
            routerExcludePath: userConfig.get('router_exclude_path') || [],
            saveOnGenerateEffectsCommandTimeout: userConfig.get('saveOnGenerateEffectsCommandTimeout') || 500,
            autoGenerateSagaEffectsCommands: userConfig.get('autoGenerateSagaEffectsCommands') || false,
            parserOptions: {
                sourceType: 'module',
                plugins: [
                    'typescript',
                    'classProperties',
                    'dynamicImport',
                    'jsx',
                    [
                        'decorators',
                        {
                            decoratorsBeforeExport: true,
                        },
                    ],
                ],
            },
            locale: userConfig.get('locale') || 'zh-CN',
        };
        const userQuotesConfig = userConfig.get('quotes');
        if (userQuotesConfig && Object.values(types_1.QuoteType).includes(userQuotesConfig)) {
            config.quotes = userQuotesConfig;
        }
        const parserOptions = userConfig.get('parser_options');
        if (parserOptions && !lodash_1.isEqual(parserOptions, {})) {
            config.parserOptions = parserOptions;
        }
        return config;
    }
    getWorkspace(filePath) {
        const workspaceFolder = this.workspaceFolders.find(o => filePath.startsWith(o.uri.fsPath));
        if (!workspaceFolder) {
            return null;
        }
        return workspaceFolder;
    }
    getProjectPath(filePath) {
        const workspaceFolder = this.getWorkspace(filePath);
        if (!workspaceFolder) {
            return null;
        }
        return workspaceFolder.uri.fsPath;
    }
};
VscodeService = __decorate([
    typedi_1.Service(exports.VscodeServiceToken),
    __metadata("design:paramtypes", [])
], VscodeService);
exports.VscodeService = VscodeService;
//# sourceMappingURL=vscodeService.js.map