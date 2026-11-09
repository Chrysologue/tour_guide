"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const db_js_1 = require("./config/db.js");
const app = (0, express_1.default)();
const port = process.env.PORT;
app.get("/", (req, res) => {
    return res.status(200).json({ message: "Welcome to Tour Guide API" });
});
app.use((req, res, next) => {
    next({ status: 404, error: "Something went wrong" });
});
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const errorMessage = status === 404 ? err.error : "Internal server error";
    return res.status(status).json({ error: errorMessage });
});
(0, db_js_1.connectToDatabase)()
    .then(() => {
    app.listen(port, () => console.log("Listening on port", port));
}).catch(err => {
    console.error(err.message);
    process.exit(1);
});
//# sourceMappingURL=server.js.map