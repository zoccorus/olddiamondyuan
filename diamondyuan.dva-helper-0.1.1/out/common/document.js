"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const config_1 = require("./config");
class TextDocumentUtils {
    constructor(document) {
        this.CharAt = (offset) => {
            if (this.outOfRange(offset)) {
                return null;
            }
            return this.document.getText(new vscode.Range(this.document.positionAt(offset), this.document.positionAt(offset + 1)));
        };
        this.outOfRange = (offset) => {
            return this.document.positionAt(offset).isEqual(this.illegal);
        };
        this.getWordInQuote = (position, quoteType) => {
            const offset = this.document.offsetAt(position);
            if (this.outOfRange(offset)) {
                return null;
            }
            const startOfLint = this.document.offsetAt(new vscode.Position(position.line, 0));
            const endOfLint = this.document.offsetAt(new vscode.Position(position.line, Infinity));
            const charArray = [];
            const quoteChar = config_1.QuoteCharMap[quoteType];
            for (let i = offset; i > -startOfLint; i--) {
                const char = this.CharAt(i);
                if (char === quoteChar || char === null) {
                    break;
                }
                charArray.unshift(char);
            }
            for (let i = offset + 1; i <= endOfLint; i++) {
                const char = this.CharAt(i);
                if (char === quoteChar || char === null) {
                    break;
                }
                charArray.push(char);
            }
            return charArray.join('');
        };
        this.document = document;
        this.illegal = document.validatePosition(new vscode.Position(Infinity, Infinity));
    }
}
exports.TextDocumentUtils = TextDocumentUtils;
//# sourceMappingURL=document.js.map