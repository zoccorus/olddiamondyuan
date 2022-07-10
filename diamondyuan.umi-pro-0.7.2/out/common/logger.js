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
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const typedi_1 = require("typedi");
exports.LoggerService = new typedi_1.Token();
function createLogger() {
    return new Logger(vscode_1.window.createOutputChannel('Umi Pro'));
}
let Logger = class Logger {
    constructor(channel) {
        this.channel = channel;
    }
    info(message) {
        console.log(message);
        this.channel.appendLine(message);
    }
};
Logger = __decorate([
    typedi_1.Service({ id: exports.LoggerService, factory: createLogger }),
    __metadata("design:paramtypes", [Object])
], Logger);
exports.Logger = Logger;
exports.default = new Logger(vscode_1.window.createOutputChannel('Umi Pro'));
//# sourceMappingURL=logger.js.map