"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
// import { mongoSession } from './config/mongoConnect';
const routes_1 = __importDefault(require("./routes"));
require("./config/passport");
const passport_1 = __importDefault(require("passport"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('tiny'));
(0, database_1.connectToDatabase)();
// app.use(mongoSession);
app.use(passport_1.default.initialize());
// app.use(passport.session());
app.use(routes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server Running here 👉 https://localhost:${PORT}`);
});
