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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const User_1 = require("../models/User");
const jwt_1 = require("../utils/jwt");
const cookieExtractor = (req) => {
    if (req && req.cookies)
        return req.cookies['jwt'].split(' ')[1];
    else
        return null;
};
var JwtOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: (0, jwt_1.getJwtSecretKey)(),
};
const verifyCallback = (jwtPayload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findById(jwtPayload.sub);
        if (!user)
            return done(null, false);
        return done(null, user);
    }
    catch (err) {
        done(err);
    }
});
const strategy = new passport_jwt_1.default.Strategy(JwtOptions, verifyCallback);
passport_1.default.use(strategy);
//@ts-ignore
passport_1.default.serializeUser(function (user, done) {
    done(null, user.id);
});
passport_1.default.deserializeUser(function (id, done) {
    User_1.User.findById(id, function (err, user) {
        done(err, user);
    });
});
