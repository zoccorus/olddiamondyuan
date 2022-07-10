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
const vscodeService_1 = require("./../vscodeService");
const utils_1 = require("../../common/utils");
const fs = require("mz/fs");
const babelParser = require("@babel/parser");
const typedi_1 = require("typedi");
const types_1 = require("@babel/types");
exports.UmircParserToken = new typedi_1.Token();
let _UmircParser = 
// eslint-disable-next-line @typescript-eslint/class-name-casing
class _UmircParser {
    constructor(vscodeService) {
        this.vscodeService = vscodeService;
    }
    parseFile(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = yield fs.readFile(path, 'utf-8');
            const config = this.vscodeService.getConfig(path);
            if (!config) {
                return [];
            }
            const ast = babelParser.parse(code, config.parserOptions);
            const exportDefaultDeclaration = ast.program.body.find((n) => types_1.isExportDefaultDeclaration(n));
            if (!exportDefaultDeclaration) {
                return [];
            }
            const defaultDeclaration = exportDefaultDeclaration.declaration;
            const umircAst = types_1.isTSAsExpression(defaultDeclaration)
                ? defaultDeclaration.expression
                : defaultDeclaration;
            if (!types_1.isObjectExpression(umircAst)) {
                return [];
            }
            return umircAst.properties.map(p => this.parseProperty(p)).filter((p) => !!p);
        });
    }
    parseProperty(prop) {
        if (types_1.isObjectMethod(prop)) {
            const { key, start, end, loc } = prop;
            if (utils_1.isNotNull(key) && utils_1.isNotNull(start) && utils_1.isNotNull(end) && utils_1.isNotNull(loc)) {
                return {
                    key: key.name,
                    start: start,
                    end: end,
                    loc: loc,
                };
            }
            return null;
        }
        if (types_1.isObjectProperty(prop)) {
            const { key, start, end, loc } = prop;
            if (utils_1.isNotNull(key) && utils_1.isNotNull(start) && utils_1.isNotNull(end) && utils_1.isNotNull(loc)) {
                return {
                    key: key.name,
                    start: start,
                    end: end,
                    loc: loc,
                };
            }
            return null;
        }
        return null;
    }
};
_UmircParser = __decorate([
    typedi_1.Service(exports.UmircParserToken)
    // eslint-disable-next-line @typescript-eslint/class-name-casing
    ,
    __param(0, typedi_1.Inject(vscodeService_1.VscodeServiceToken)),
    __metadata("design:paramtypes", [Object])
], _UmircParser);
//# sourceMappingURL=umircParser.js.map