"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtSecretKey = exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateJWT = function (user) {
    const id = user.id;
    const payload = {
        sub: id,
        iat: Date.now(),
    };
    const jwtSecret = (0, exports.getJwtSecretKey)();
    if (!jwtSecret)
        throw new Error('No JWT Key Found!');
    const signedToken = jsonwebtoken_1.default.sign(payload, jwtSecret, {
        expiresIn: '1d',
    });
    return {
        token: 'Bearer ' + signedToken,
        expires: 1000 * 60 * 60 * 24,
    };
};
exports.generateJWT = generateJWT;
const getJwtSecretKey = function () {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret)
        throw new Error('No JWT Key Found!');
    return jwtSecret;
};
exports.getJwtSecretKey = getJwtSecretKey;
