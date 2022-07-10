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
const vscode_1 = require("vscode");
const fs = require("mz/fs");
const babelParser = require("@babel/parser");
const traverse_1 = require("@babel/traverse");
const types_1 = require("@babel/types");
const typedi_1 = require("typedi");
const vscodeService_1 = require("./../vscodeService");
const utils_1 = require("../../common/utils");
exports.ModelReferenceParserToken = new typedi_1.Token();
let _ModelReferenceParser = 
// eslint-disable-next-line @typescript-eslint/class-name-casing
class _ModelReferenceParser {
    constructor(vscodeService) {
        this.vscodeService = vscodeService;
    }
    parseFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = yield fs.readFile(filePath, 'utf-8');
            const config = this.vscodeService.getConfig(filePath);
            if (!config) {
                return [];
            }
            const ast = babelParser.parse(code, config.parserOptions);
            const result = [];
            traverse_1.default(ast, {
                enter(path) {
                    const { node } = path;
                    if (!types_1.isCallExpression(node)) {
                        return;
                    }
                    const { callee } = node;
                    if (!types_1.isIdentifier(callee) || node.arguments.length !== 1) {
                        return;
                    }
                    if (callee.name !== 'dispatch' && callee.name !== 'put') {
                        return;
                    }
                    const [firstArgument] = node.arguments;
                    if (!types_1.isObjectExpression(firstArgument)) {
                        return;
                    }
                    firstArgument.properties.forEach(property => {
                        if (!types_1.isObjectProperty(property)) {
                            return;
                        }
                        const { value, key } = property;
                        if (!types_1.isIdentifier(key) || key.name !== 'type' || !types_1.isStringLiteral(value) || !value.loc) {
                            return;
                        }
                        result.push({
                            type: value.value,
                            uri: vscode_1.Uri.file(filePath),
                            range: utils_1.sourceLocationToRange(value.loc),
                        });
                    });
                },
            });
            return result;
        });
    }
};
_ModelReferenceParser = __decorate([
    typedi_1.Service(exports.ModelReferenceParserToken)
    // eslint-disable-next-line @typescript-eslint/class-name-casing
    ,
    __param(0, typedi_1.Inject(vscodeService_1.VscodeServiceToken)),
    __metadata("design:paramtypes", [Object])
], _ModelReferenceParser);
//# sourceMappingURL=modelReferenceParser.js.map