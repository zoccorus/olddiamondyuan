"use strict";
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
const types_1 = require("@babel/types");
const generator_1 = require("@babel/generator");
class DvaModelParser {
    parse(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const ast = babelParser.parse(code, {
                sourceType: 'module',
                plugins: [
                    'typescript',
                    'classProperties',
                    'jsx',
                    [
                        'decorators',
                        {
                            decoratorsBeforeExport: true,
                        },
                    ],
                ],
            });
            let modelObjects = [];
            for (const node of ast.program.body) {
                let model = node;
                if (types_1.isExportDefaultDeclaration(model)) {
                    model = model.declaration;
                }
                if (types_1.isObjectExpression(model)) {
                    modelObjects.push(model);
                }
            }
            return modelObjects
                .map(o => this.parseObjectExpression(o))
                .filter(o => !!o);
        });
    }
    parseFile(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = yield fs.readFile(path, 'utf-8');
            return this.parse(code);
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
        if (Object.keys(result.effects).length === 0 &&
            Object.keys(result.reducers).length === 0) {
            return null;
        }
        return result;
    }
}
exports.DvaModelParser = DvaModelParser;
//# sourceMappingURL=index.js.map