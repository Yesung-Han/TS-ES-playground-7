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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch_1 = require("@elastic/elasticsearch");
require("dotenv/config");
const INDEX = process.env.ES_INDEX_PATTERN || '';
console.log(INDEX);
const client = new elasticsearch_1.Client({
    node: process.env.ES_CLOUD_NODE || '',
    auth: {
        username: process.env.ES_CLOUD_USERNAME || '',
        password: process.env.ES_CLOUD_PASSWORD || ''
    }
});
const runSearch = (index) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // new definitions
        const response = yield client.search({
            index,
            size: 10000,
            body: {
                query: {
                    match_all: {}
                }
            }
        });
        const documents = ((_b = (_a = response === null || response === void 0 ? void 0 : response.body) === null || _a === void 0 ? void 0 : _a.hits) === null || _b === void 0 ? void 0 : _b.hits) || [];
        return documents;
    }
    catch (error) {
        // (error as AxiosError).message
        console.log(error);
        throw error;
    }
});
function scrollSearch(params) {
    return __asyncGenerator(this, arguments, function* scrollSearch_1() {
        let response = yield __await(client.search(params));
        while (true) {
            const sourceHits = response.body.hits.hits;
            if (sourceHits.length === 0) {
                break;
            }
            for (const hit of sourceHits) {
                yield yield __await(hit);
            }
            if (!response.body._scroll_id) {
                break;
            }
            console.log(response);
            response = yield __await(client.scroll({
                scroll_id: response.body._scroll_id,
                scroll: params.scroll
            }));
        }
    });
}
const runScroll = (index) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, e_1, _d, _e;
    try {
        // new definitions
        const params = {
            index,
            scroll: '30s',
            size: 10000,
            body: {
                query: {
                    match_all: {}
                }
            }
        };
        let results = [];
        try {
            for (var _f = true, _g = __asyncValues(scrollSearch(params)), _h; _h = yield _g.next(), _c = _h.done, !_c;) {
                _e = _h.value;
                _f = false;
                try {
                    const hit = _e;
                    results.push(hit);
                }
                finally {
                    _f = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_f && !_c && (_d = _g.return)) yield _d.call(_g);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return results;
    }
    catch (error) {
        // (error as AxiosError).message
        throw error;
    }
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield runScroll(INDEX);
    console.log([res[0]], res.length);
});
main();
