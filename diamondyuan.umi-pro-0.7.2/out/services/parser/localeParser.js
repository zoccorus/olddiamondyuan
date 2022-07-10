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
const vscode = require("vscode");
const vscodeService_1 = require("./../vscodeService");
const fs = require("mz/fs");
const path_1 = require("path");
const babelParser = require("@babel/parser");
const types_1 = require("@babel/types");
const typedi_1 = require("typedi");
const utils_1 = require("../../common/utils");
exports.LocaleParserToken = new typedi_1.Token();
let _LocaleParser = 
// eslint-disable-next-line @typescript-eslint/class-name-casing
class _LocaleParser {
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
            const localeAst = types_1.isTSAsExpression(defaultDeclaration)
                ? defaultDeclaration.expression
                : defaultDeclaration;
            if (!types_1.isObjectExpression(localeAst)) {
                return [];
            }
            const result = yield Promise.all(localeAst.properties
                .map(p => {
                let propLoc = p.loc;
                let propKey = '';
                if (types_1.isObjectProperty(p)) {
                    propKey = p.key.name;
                    if (types_1.isStringLiteral(p.key)) {
                        propKey = p.key.value;
                        propLoc = p.key.loc;
                    }
                }
                if (types_1.isSpreadElement(p)) {
                    return this.getSpreadProperties(path, p, ast.program.body);
                }
                if (!propLoc || !propKey) {
                    return null;
                }
                return Promise.resolve({
                    fileUri: vscode.Uri.file(path),
                    key: propKey,
                    range: new vscode.Range(propLoc.start.line - 1, propLoc.start.column, propLoc.end.line - 1, propLoc.end.column),
                });
            })
                .filter((p) => !!p));
            return utils_1.flatten(result);
        });
    }
    getSpreadProperties(path, prop, astbody) {
        return __awaiter(this, void 0, void 0, function* () {
            const { argument } = prop;
            if (!types_1.isIdentifier(argument)) {
                return [];
            }
            const { name } = argument;
            const result = yield this.parseByIdentifier(path, name, astbody);
            return result;
        });
    }
    parseByIdentifier(path, identifier, astbody) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = astbody.find(a => {
                return (types_1.isImportDeclaration(a) &&
                    a.specifiers.some(s => types_1.isImportDefaultSpecifier(s) && s.local.name === identifier));
            });
            if (!found || !types_1.isImportDeclaration(found) || !types_1.isStringLiteral(found.source)) {
                return [];
            }
            const filePathPrefix = path_1.join(path_1.dirname(path), found.source.value);
            const targetFiles = [filePathPrefix, `${filePathPrefix}.js`, `${filePathPrefix}.ts`];
            const targetFile = targetFiles.find(t => fs.existsSync(t));
            if (!targetFile) {
                return [];
            }
            const result = yield this.parseFile(targetFile);
            return result;
        });
    }
};
_LocaleParser = __decorate([
    typedi_1.Service(exports.LocaleParserToken)
    // eslint-disable-next-line @typescript-eslint/class-name-casing
    ,
    __param(0, typedi_1.Inject(vscodeService_1.VscodeServiceToken)),
    __metadata("design:paramtypes", [Object])
], _LocaleParser);
//# sourceMappingURL=localeParser.js.map