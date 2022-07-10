"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("@babel/parser");
const types_1 = require("@babel/types");
/**
 *
 * 判断是否是路由配置里面的 component 路径
 *
 * @param code 路由配置的代码
 * @param path 在引号里的字符串
 */
function isPathInRouter(code, path, options) {
    const ast = parser_1.parseExpression(code, options);
    if (!types_1.isObjectExpression(ast)) {
        return false;
    }
    return ast.properties.some(property => {
        if (!types_1.isObjectProperty(property)) {
            return false;
        }
        const { key, value } = property;
        if (!types_1.isIdentifier(key) || key.name !== 'component') {
            return false;
        }
        if (!types_1.isStringLiteral(value) || value.value !== path) {
            return false;
        }
        return true;
    });
}
exports.isPathInRouter = isPathInRouter;
//# sourceMappingURL=index.js.map