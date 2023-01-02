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
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch_1 = require("@elastic/elasticsearch");
require("dotenv/config");
const client = new elasticsearch_1.Client({
    cloud: { id: process.env.ES_CLOUD_NODE || '' },
    auth: {
        username: process.env.ES_CLOUD_USERNAME || '',
        password: process.env.ES_CLOUD_PASSWORD || ''
    }
});
const runQuery = (index) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // new definitions
        const response = yield client.search({
            index: 'test',
            body: {
                query: {
                    match: { foo: '123' }
                }
            }
        });
        console.log(response.body);
    }
    catch (error) {
        // (error as AxiosError).message
        console.log(error);
    }
});
runQuery('').catch(console.log);
