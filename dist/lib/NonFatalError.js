"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonFatalError = void 0;
class NonFatalError extends Error {
    constructor() {
        super(...arguments);
        this.nonFatal = true;
    }
}
exports.NonFatalError = NonFatalError;
