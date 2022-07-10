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
const fs = require("mz/fs");
const babelParser = require("@babel/parser");
const types_1 = require("@babel/types");
const generator_1 = require("@babel/generator");
const typedi_1 = require("typedi");
exports.DvaModelParserToken = new typedi_1.Token();
let _DvaModelParser = 
// eslint-disable-next-line @typescript-eslint/class-name-casing
class _DvaModelParser {
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
            let modelObjects = [];
            for (const node of ast.program.body) {
                let model = node;
                if (types_1.isExportDefaultDeclaration(model)) {
                    model = model.declaration;
                }
                if (types_1.isObjectExpression(model)) {
                    modelObjects.push(model);
                }
                if (types_1.isCallExpression(model)) {
                    const args = model.arguments.filter((o) => types_1.isObjectExpression(o));
                    modelObjects.push(...args);
                }
            }
            return modelObjects.map(o => this.parseObjectExpression(o)).filter(o => !!o);
        });
    }
    parseObjectExpression(ast) {
        const result = {
            namespace: '',
            effects: {},
            reducers: {},
        };
        ast.properties.forEach(property => {
            if (!types_1.isObjectProperty(property)) {
                return;
            }
            const key = property.key.name;
            if (key === 'namespace' && types_1.isStringLiteral(property.value)) {
                result.namespace = property.value.value;
                return;
            }
            let isEffectsOrReducers = key === 'effects' || key === 'reducers';
            if (isEffectsOrReducers && types_1.isObjectExpression(property.value)) {
                const { value } = property;
                value.properties.forEach(valueProperty => {
                    if (!types_1.isObjectMethod(valueProperty)) {
                        return;
                    }
                    const methodName = valueProperty.key.name;
                    const { code } = generator_1.default(valueProperty);
                    const { loc } = valueProperty;
                    result[key][methodName] = {
                        code,
                        loc,
                    };
                });
            }
        });
        if (!result.namespace) {
            return null;
        }
        if (Object.keys(result.effects).length === 0 && Object.keys(result.reducers).length === 0) {
            return null;
        }
        return result;
    }
};
_DvaModelParser = __decorate([
    typedi_1.Service(exports.DvaModelParserToken)
    // eslint-disable-next-line @typescript-eslint/class-name-casing
    ,
    __param(0, typedi_1.Inject(vscodeService_1.VscodeServiceToken)),
    __metadata("design:paramtypes", [Object])
], _DvaModelParser);
//# sourceMappingURL=dvaModelParser.js.map