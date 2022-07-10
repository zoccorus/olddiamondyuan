"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var QuoteType;
(function (QuoteType) {
    QuoteType["double"] = "double";
    QuoteType["single"] = "single";
    QuoteType["backtick"] = "backtick";
})(QuoteType = exports.QuoteType || (exports.QuoteType = {}));
exports.QuoteCharMap = {
    [QuoteType.single]: "'",
    [QuoteType.double]: '"',
    [QuoteType.backtick]: '`',
};
exports.DEFAULT_ROUTER_CONFIG_PATH = [
    '.umirc.js',
    '.umirc.ts',
    'config/config.js',
    'config/router.config.js',
];
var Brackets;
(function (Brackets) {
    Brackets["ROUND"] = "()";
    Brackets["BOX"] = "[]";
    Brackets["CURLY"] = "{}";
})(Brackets = exports.Brackets || (exports.Brackets = {}));
exports.JS_EXT_NAMES = ['.js', '.jsx', '.ts', '.tsx'];
exports.EXCLUDE_EXT_NAMES = ['.d.ts', '.test.js', '.test.jsx', '.test.ts', '.test.tsx'];
exports.SUPPORT_LANGUAGE = ['javascript', 'typescript', 'typescriptreact'];
//# sourceMappingURL=types.js.map