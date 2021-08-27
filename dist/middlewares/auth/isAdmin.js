"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isAdmin = (req, res, next) => {
    //@ts-ignore
    if (req.user.isAdmin)
        return next();
    return res.status(401).send('Unauthorized');
};
exports.default = isAdmin;
