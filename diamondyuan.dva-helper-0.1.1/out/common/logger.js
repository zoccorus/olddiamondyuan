"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class Logger {
    constructor() {
        this.channel = vscode_1.window.createOutputChannel('dva_helper');
    }
    info(message) {
        console.log(message);
        this.channel.appendLine(message);
    }
}
exports.default = new Logger();
//# sourceMappingURL=logger.js.map