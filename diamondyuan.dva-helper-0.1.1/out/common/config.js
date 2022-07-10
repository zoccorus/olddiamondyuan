"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const CONFIG_NAMESPACE = 'dva_helper';
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
function getConfig() {
    const config = { quotes: QuoteType.single };
    const userConfig = vscode.workspace.getConfiguration(CONFIG_NAMESPACE);
    const userQuotesConfig = userConfig.get('quotes');
    if (userQuotesConfig && Object.values(QuoteType).includes(userQuotesConfig)) {
        config.quotes = userQuotesConfig;
    }
    return config;
}
exports.getConfig = getConfig;
//# sourceMappingURL=config.js.map