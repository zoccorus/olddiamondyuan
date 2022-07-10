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
const vscodeService_1 = require("./vscodeService");
const logger_1 = require("./../common/logger");
const typedi_1 = require("typedi");
const types_2 = require("../common/types");
const path_1 = require("path");
const globby_1 = require("globby");
exports.RouterInfoServiceToken = new typedi_1.Token();
let RouterInfoService = class RouterInfoService {
    constructor(logger, vscodeService) {
        this.getAllPages = (cwd) => __awaiter(this, void 0, void 0, function* () {
            const config = this.vscodeService.getConfig(cwd);
            let pagePattern = [
                `./**/*{${types_2.JS_EXT_NAMES.join(',')}}`,
                `!./**/models/**/*{${types_2.JS_EXT_NAMES.join(',')}}`,
                '!**/model.js',
            ];
            if (config && Array.isArray(config.routerExcludePath)) {
                pagePattern = pagePattern.concat(config.routerExcludePath.map(o => `!${o}`));
            }
            const pages = (yield globby_1.default(pagePattern, {
                cwd,
                deep: true,
            })).filter(p => types_1.EXCLUDE_EXT_NAMES.every(ext => !p.endsWith(ext)));
            const pageSet = pages.reduce((set, page) => {
                const ext = path_1.extname(page);
                let pagePath = page.slice(0, -ext.length);
                if (path_1.basename(pagePath) === 'index' && pagePath !== 'index') {
                    pagePath = path_1.dirname(pagePath);
                }
                set.add(pagePath);
                return set;
            }, new Set());
            return Array.from(pageSet);
        });
        this.logger = logger;
        this.logger.info('create RouterInfoService');
        this.vscodeService = vscodeService;
    }
};
RouterInfoService = __decorate([
    typedi_1.Service(exports.RouterInfoServiceToken),
    __param(0, typedi_1.Inject(logger_1.LoggerService)),
    __param(1, typedi_1.Inject(vscodeService_1.VscodeServiceToken)),
    __metadata("design:paramtypes", [Object, Object])
], RouterInfoService);
exports.RouterInfoService = RouterInfoService;
//# sourceMappingURL=routerService.js.map