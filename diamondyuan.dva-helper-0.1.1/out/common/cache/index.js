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
const path_1 = require("path");
const fs = require("mz/fs");
const parser_1 = require("../parser");
const logger_1 = require("../logger");
const utils_1 = require("../utils");
class ModelInfoCache {
    constructor() {
        this.getModules = (filePath, projectPath) => __awaiter(this, void 0, void 0, function* () {
            let project = this.cache.projects[projectPath];
            if (!project) {
                logger_1.default.info(`load project ${projectPath}`);
                project = {
                    globalModels: yield utils_1.getModels(path_1.join(projectPath, 'src')),
                };
                this.cache.projects[projectPath] = project;
            }
            try {
                const pageModels = yield utils_1.getPageModels(filePath, projectPath);
                return this.filesToModels(project.globalModels.concat(pageModels));
            }
            catch (error) {
                console.log(error);
                return [];
            }
        });
        this.cache = {
            center: {},
            projects: {},
        };
        this.parser = new parser_1.DvaModelParser();
    }
    reloadFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            this.cache.center[filePath] = [];
            yield this.loadFile(filePath);
            const projects = Object.keys(this.cache.projects);
            projects.forEach(key => {
                if (filePath.startsWith[key]) {
                    const models = this.cache.projects[key];
                    if (models.globalModels.every(path => path !== filePath)) {
                        models.globalModels.push(filePath);
                    }
                }
            });
        });
    }
    getCurrentNameSpace(filePath) {
        const dvaModels = this.cache.center[filePath];
        if (!dvaModels || dvaModels.length !== 1) {
            return null;
        }
        return dvaModels[0].namespace;
    }
    filesToModels(files) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(files.map(file => this.loadFile(file)));
            return files.reduce((previousValue, filePath) => {
                const models = this.cache.center[filePath];
                if (Array.isArray(models)) {
                    return previousValue.concat(models.map(({ namespace, effects, reducers }) => ({
                        filePath,
                        namespace,
                        effects,
                        reducers,
                    })));
                }
                return previousValue;
            }, []);
        });
    }
    loadFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield fs.exists(filePath)) {
                try {
                    this.cache.center[filePath] = yield this.parser.parseFile(filePath);
                }
                catch (error) {
                    logger_1.default.info(`解析文件失败 ${filePath}`);
                    logger_1.default.info(error.message);
                }
            }
        });
    }
}
exports.default = new ModelInfoCache();
//# sourceMappingURL=index.js.map