"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.poll = exports.clamp = exports.mapRange = exports.throttle = exports.debounce = exports.singleton = exports.delegate = exports.pauseIncrement = exports.pause = void 0;
var pause = function (ms) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                var timeout = setTimeout(resolve, ms);
                return function () {
                    clearTimeout(timeout);
                    reject("pause canceled");
                };
            })];
    });
}); };
exports.pause = pause;
var pauseIncrement = function (range, ms, limit) {
    if (limit === void 0) { limit = true; }
    var i = 0;
    return function () {
        var s = (0, exports.mapRange)(i++, range, ms);
        if (limit)
            s = (0, exports.clamp)(s, ms[0], ms[1]);
        return (0, exports.pause)(s);
    };
};
exports.pauseIncrement = pauseIncrement;
var delegate = function () {
    var resolve;
    var reject;
    var promise = new Promise(function (res, rej) {
        resolve = res;
        reject = rej;
    });
    return { promise: promise, resolve: resolve, reject: reject };
};
exports.delegate = delegate;
var singleton = function (fn) {
    var promise;
    return function () {
        promise !== null && promise !== void 0 ? promise : (promise = fn());
        promise.finally(function () { return promise = undefined; });
        return promise;
    };
};
exports.singleton = singleton;
var debounce = function (threshold, fn) {
    var t;
    var d;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!d) {
            d = (0, exports.delegate)();
            d.promise.finally(function () { return d = undefined; });
        }
        clearTimeout(t);
        t = setTimeout(function () {
            var p = fn.apply(void 0, args);
            p.then(function (x) { return d === null || d === void 0 ? void 0 : d.resolve(x); });
            p.catch(function (x) { return d === null || d === void 0 ? void 0 : d.reject(x); });
        }, threshold);
        return d.promise;
    };
};
exports.debounce = debounce;
var throttle = function (threshold, fn, tail) {
    if (tail === void 0) { tail = false; }
    var t;
    var n;
    var d;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!d) {
            d = (0, exports.delegate)();
            d.promise.finally(function () { return d = undefined; });
        }
        clearTimeout(t);
        var now = Date.now();
        if (!n || now - n >= threshold) {
            n = now;
            var p = fn.apply(void 0, args);
            p.then(function (x) { return d === null || d === void 0 ? void 0 : d.resolve(x); });
            p.catch(function (x) { return d === null || d === void 0 ? void 0 : d.reject(x); });
        }
        else if (tail)
            t = setTimeout(function () {
                var p = fn.apply(void 0, args);
                p.then(function (x) { return d === null || d === void 0 ? void 0 : d.resolve(x); });
                p.catch(function (x) { return d === null || d === void 0 ? void 0 : d.reject(x); });
            }, threshold);
        return d.promise;
    };
};
exports.throttle = throttle;
var mapRange = function (value, source, target) {
    return target[0] + (value - source[0]) * (target[1] - target[0]) / (source[1] - source[0]);
};
exports.mapRange = mapRange;
var clamp = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
};
exports.clamp = clamp;
var poll = function (fn, threshold, max) { return __awaiter(void 0, void 0, void 0, function () {
    var i, pi, x;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 0;
                pi = (0, exports.pauseIncrement)([0, max], threshold);
                _a.label = 1;
            case 1:
                if (!(i < max)) return [3 /*break*/, 4];
                return [4 /*yield*/, fn()];
            case 2:
                x = _a.sent();
                if (x)
                    return [2 /*return*/];
                return [4 /*yield*/, pi()];
            case 3:
                _a.sent();
                return [3 /*break*/, 1];
            case 4: throw new Error("poll reached timeout (".concat(max, " ms)"));
        }
    });
}); };
exports.poll = poll;
