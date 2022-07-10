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
const fs = require("mz/fs");
const babelParser = require("@babel/parser");
const traverse_1 = require("@babel/traverse");
const types_1 = require("@babel/types");
const typedi_1 = require("typedi");
const vscodeService_1 = require("./../vscodeService");
const utils_1 = require("../../common/utils");
const generator_1 = require("@babel/generator");
const lodash_1 = require("lodash");
exports.ModelEffectsParserToken = new typedi_1.Token();
const reduxSagaEffectsCommands = ['put', 'call', 'select', 'cancel', 'take', 'all'];
let _ModelEffectParser = 
// eslint-disable-next-line @typescript-eslint/class-name-casing
class _ModelEffectParser {
    constructor(vscodeService) {
        this.traverseCallExpression = (node, effectsCommands) => {
            if (!types_1.isCallExpression(node)) {
                return;
            }
            const { callee } = node;
            if (!types_1.isIdentifier(callee)) {
                return;
            }
            if (reduxSagaEffectsCommands.some(o => o === callee.name)) {
                effectsCommands.add(callee.name);
            }
            if (callee.name === 'all') {
                const { arguments: nodeArguments } = node;
                if (nodeArguments.length !== 1) {
                    return;
                }
                const firstArg = nodeArguments[0];
                if (!types_1.isArrayExpression(firstArg)) {
                    return;
                }
                firstArg.elements.forEach(o => {
                    if (o) {
                        this.traverseCallExpression(o, effectsCommands);
                    }
                });
            }
        };
        this.getEffectsCommands = (node) => {
            const effectsCommands = new Set();
            const { traverseCallExpression } = this;
            traverse_1.default(node, {
                YieldExpression(path) {
                    const { node } = path;
                    const { argument } = node;
                    traverseCallExpression(argument, effectsCommands);
                },
            }, {});
            return Array.from(effectsCommands);
        };
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
            const { isDvaEffects, isDvaModelCreatorEffects, getEffectsCommands, getParamsEffectsCommands, } = this;
            traverse_1.default(ast, {
                enter(path) {
                    const { node } = path;
                    if (isDvaEffects(node) || isDvaModelCreatorEffects(node)) {
                        if (!node.loc) {
                            return;
                        }
                        const effectsCommands = getEffectsCommands(node);
                        if (utils_1.isNotNull(effectsCommands) && effectsCommands.length > 0) {
                            const paramsEffectsCommands = getParamsEffectsCommands(node) || [];
                            if (lodash_1.isEqual(effectsCommands.sort(), paramsEffectsCommands.sort())) {
                                return;
                            }
                            let [action] = node.params;
                            if (!action) {
                                node.params[0] = types_1.identifier('_');
                            }
                            node.params[1] = types_1.objectPattern(effectsCommands.map(key => {
                                return types_1.objectProperty(types_1.identifier(key), types_1.identifier(key), false, true);
                            }));
                            const { code } = generator_1.default(node, { retainLines: true });
                            const codeArray = code.split('\n');
                            let i = 0;
                            while (!codeArray[i]) {
                                i++;
                            }
                            result.push({
                                range: utils_1.sourceLocationToRange(node.loc),
                                code: codeArray.slice(i).join('\n'),
                            });
                        }
                    }
                },
            });
            return result;
        });
    }
    isDvaEffects(node) {
        if (types_1.isObjectMethod(node) && node.generator) {
            return true;
        }
        return false;
    }
    isDvaModelCreatorEffects(node) {
        if (types_1.isFunctionExpression(node) && node.generator) {
            return true;
        }
        return false;
    }
    getParamsEffectsCommands(node) {
        const effectsCommandsNode = node.params[1];
        if (!effectsCommandsNode || !types_1.isObjectPattern(effectsCommandsNode)) {
            return null;
        }
        return effectsCommandsNode.properties
            .map(o => {
            if (types_1.isObjectProperty(o) && types_1.isIdentifier(o.key)) {
                return o.key.name;
            }
            return null;
        })
            .filter((o) => !!o);
    }
};
_ModelEffectParser = __decorate([
    typedi_1.Service(exports.ModelEffectsParserToken)
    // eslint-disable-next-line @typescript-eslint/class-name-casing
    ,
    __param(0, typedi_1.Inject(vscodeService_1.VscodeServiceToken)),
    __metadata("design:paramtypes", [Object])
], _ModelEffectParser);
//# sourceMappingURL=modelEffectsParser.js.map