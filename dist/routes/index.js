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
const express_1 = require("express");
const User_1 = require("./../models/User");
const password_1 = require("../utils/password");
const isAuth_1 = __importDefault(require("../middlewares/auth/isAuth"));
const isAdmin_1 = __importDefault(require("../middlewares/auth/isAdmin"));
const jwt_1 = require("../utils/jwt");
const router = (0, express_1.Router)();
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findOne({ username: req.body.username });
    if (!user)
        return res.status(401).send('Invalid Username Or Password');
    const isValid = yield (0, password_1.validatePassword)(req.body.password, user.hashedPassword);
    if (!isValid)
        return res.status(401).send('Invalid Username Or Password');
    const tokenObject = (0, jwt_1.generateJWT)(user);
    return res
        .cookie('jwt', tokenObject.token, {
        httpOnly: true,
        maxAge: tokenObject.expires,
    })
        .send('logged in!');
}));
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const hashedPassword = (0, password_1.generatePassword)(password);
    const user = new User_1.User({ username, hashedPassword });
    yield user.save();
    return res.send('register done');
}));
router.get('/logout', (req, res) => {
    if (!req.isAuthenticated())
        return res.status(400).send('Not logged in!');
    req.logout();
    return res.status(200).send('Successfully logged out!');
});
router.get('/protected', isAuth_1.default, (req, res) => {
    console.log(req.isAuthenticated());
    return res.status(200).send('protected route!!');
});
router.get('/admin', [isAuth_1.default, isAdmin_1.default], (req, res) => {
    return res.status(200).send('admin route!!');
});
exports.default = router;
