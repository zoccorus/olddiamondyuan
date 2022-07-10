"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const types_1 = require("./types");
const utils_1 = require("./utils");
class TextDocumentUtils {
    constructor(document) {
        this.CharAt = (offset) => {
            if (this.outOfRange(offset)) {
                throw new Error('illegal offset');
            }
            return this.document.getText(new vscode.Range(this.document.positionAt(offset), this.document.positionAt(offset + 1)));
        };
        this.outOfRange = (offset) => {
            return this.document.positionAt(offset).isEqual(this.illegal);
        };
        this.getQuoteRange = (position, quoteType) => {
            const offset = this.document.offsetAt(position);
            if (this.outOfRange(offset)) {
                return null;
            }
            const startOfLint = this.document.offsetAt(new vscode.Position(position.line, 0));
            const endOfLint = this.document.offsetAt(new vscode.Position(position.line, Infinity));
            const quoteChar = types_1.QuoteCharMap[quoteType];
            let frontQuoteOffset;
            for (let i = offset - 1; i >= startOfLint; i--) {
                if (this.CharAt(i) === quoteChar) {
                    frontQuoteOffset = i;
                    break;
                }
            }
            if (utils_1.isUndefined(frontQuoteOffset)) {
                return null;
            }
            let endQuoteOffset;
            for (let i = offset; i <= endOfLint; i++) {
                if (this.CharAt(i) === quoteChar) {
                    endQuoteOffset = i;
                    break;
                }
            }
            if (utils_1.isUndefined(endQuoteOffset)) {
                return null;
            }
            return new vscode.Range(this.document.positionAt(frontQuoteOffset), this.document.positionAt(endQuoteOffset + 1));
        };
        this.document = document;
        this.illegal = document.validatePosition(new vscode.Position(Infinity, Infinity));
    }
    growBracketsRange(positionOrRange, brackets) {
        let start;
        let end;
        if (positionOrRange instanceof vscode.Position) {
            start = this.document.offsetAt(positionOrRange);
            end = this.document.offsetAt(positionOrRange);
        }
        else {
            start = this.document.offsetAt(positionOrRange.start);
            end = this.document.offsetAt(positionOrRange.end);
        }
        let growStart;
        let growEnd;
        const startOfDocument = this.document.offsetAt(new vscode.Position(0, 0));
        if (startOfDocument === start) {
            return null;
        }
        const endOfDocument = this.document.offsetAt(new vscode.Position(Infinity, Infinity));
        if (endOfDocument === end) {
            return null;
        }
        let bracketsStack = [];
        const leftBrackets = brackets[0];
        const rightBrackets = brackets[1];
        for (let i = start - 1; i >= startOfDocument; i--) {
            if (this.CharAt(i) === rightBrackets) {
                bracketsStack.push(brackets);
            }
            else if (this.CharAt(i) === leftBrackets) {
                if (bracketsStack.length === 0) {
                    growStart = i;
                    break;
                }
                else {
                    bracketsStack.pop();
                }
            }
        }
        if (!growStart) {
            return null;
        }
        bracketsStack = [];
        for (let i = end + 1; i <= endOfDocument; i++) {
            if (this.CharAt(i) === leftBrackets) {
                bracketsStack.push(brackets);
            }
            else if (this.CharAt(i) === rightBrackets) {
                if (bracketsStack.length === 0) {
                    growEnd = i;
                    break;
                }
                else {
                    bracketsStack.pop();
                }
            }
        }
        if (!growEnd) {
            return null;
        }
        return new vscode.Range(this.document.positionAt(growStart), this.document.positionAt(growEnd + 1));
    }
}
exports.TextDocumentUtils = TextDocumentUtils;
//# sourceMappingURL=document.js.map