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
const vscode_1 = require("vscode");
require("reflect-metadata");
const typedi_1 = require("typedi");
const model_1 = require("./language/model");
const locale_1 = require("./language/locale");
const umircDecoration_1 = require("./language/umircDecoration");
const router_1 = require("./language/router");
const logger_1 = require("./common/logger");
const fileWatcher_1 = require("./common/fileWatcher");
const vscodeService_1 = require("./services/vscodeService");
const modelInfoService_1 = require("./services/modelInfoService");
const localeService_1 = require("./services/localeService");
const types_1 = require("./common/types");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info('extension "umi-pro" is now active!');
        const umiFileWatcher = yield fileWatcher_1.getUmiFileWatcher(vscode_1.workspace.workspaceFolders);
        if (!umiFileWatcher) {
            logger_1.default.info('no project use umi');
            return;
        }
        const modelInfoService = typedi_1.Container.get(modelInfoService_1.ModelInfoServiceToken);
        umiFileWatcher.onDidChange(e => modelInfoService.updateFile(e.fsPath));
        umiFileWatcher.onDidCreate(e => modelInfoService.updateFile(e.fsPath));
        umiFileWatcher.onDidDelete(e => modelInfoService.updateFile(e.fsPath));
        const localeService = typedi_1.Container.get(localeService_1.LocaleServiceToken);
        umiFileWatcher.onDidCreate(e => localeService.updateFile(e.fsPath));
        umiFileWatcher.onDidChange(e => localeService.updateFile(e.fsPath));
        umiFileWatcher.onDidDelete(e => localeService.deleteFile(e.fsPath));
        let vscodeService = typedi_1.Container.get(vscodeService_1.VscodeServiceToken);
        yield vscodeService_1.loadVscodeService(vscodeService);
        yield localeService.initLocales();
        vscode_1.workspace.onDidChangeWorkspaceFolders(() => vscodeService_1.loadVscodeService(vscodeService));
        vscode_1.workspace.onDidChangeConfiguration(() => vscodeService_1.loadVscodeService(vscodeService));
        context.subscriptions.push(vscode_1.languages.registerCompletionItemProvider(types_1.SUPPORT_LANGUAGE, typedi_1.Container.get(model_1.ActionTypeCompletionItemProvider), ':'));
        context.subscriptions.push(vscode_1.languages.registerHoverProvider(types_1.SUPPORT_LANGUAGE, typedi_1.Container.get(model_1.ActionTypeHoverProvider)));
        context.subscriptions.push(vscode_1.languages.registerDefinitionProvider(types_1.SUPPORT_LANGUAGE, typedi_1.Container.get(model_1.ActionTypeDefinitionProvider)));
        context.subscriptions.push(vscode_1.languages.registerDefinitionProvider(types_1.SUPPORT_LANGUAGE, typedi_1.Container.get(router_1.UmiRouterDefinitionProvider)));
        context.subscriptions.push(vscode_1.languages.registerCompletionItemProvider(types_1.SUPPORT_LANGUAGE, typedi_1.Container.get(router_1.UmiRouterCompletionItemProvider), ...['/']));
        context.subscriptions.push(vscode_1.languages.registerCompletionItemProvider(types_1.SUPPORT_LANGUAGE, typedi_1.Container.get(locale_1.LocaleKeyCompletionItemProvider), '=', ' ', ':'));
        context.subscriptions.push(vscode_1.languages.registerDefinitionProvider(types_1.SUPPORT_LANGUAGE, typedi_1.Container.get(locale_1.LocaleDefinitionProvider)));
        context.subscriptions.push(vscode_1.languages.registerReferenceProvider(types_1.SUPPORT_LANGUAGE, typedi_1.Container.get(model_1.ModelActionReference)));
        context.subscriptions.push(typedi_1.Container.get(umircDecoration_1.UmircDecoration));
        context.subscriptions.push(typedi_1.Container.get(model_1.ModelEffectsGenerator));
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map