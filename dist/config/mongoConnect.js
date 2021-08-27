"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoSession = void 0;
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sessionStore = connect_mongo_1.default.create({
    mongoUrl: process.env.MONGODB_URL,
    dbName: process.env.DB_NAME,
    collectionName: process.env.SESSIONS_COLLECTION,
});
exports.mongoSession = (0, express_session_1.default)({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    },
});
