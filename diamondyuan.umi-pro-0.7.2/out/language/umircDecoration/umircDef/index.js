"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const en_1 = require("./en");
const zh_cn_1 = require("./zh_cn");
function getlang() {
    const sysLang = vscode_1.env.language.replace('-', '_');
    if (sysLang === 'en' || sysLang !== 'zh_cn') {
        return en_1.default;
    }
    return zh_cn_1.default;
}
exports.getlang = getlang;
//# sourceMappingURL=index.js.map