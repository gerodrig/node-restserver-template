"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || 3000;
        //middlewares
        this.middlewares();
        //call your routes method
        this.routes();
    }
    middlewares() {
        //public directory
        this.app.use(express_1.default.static('public'));
        //define CORS
        this.app.use((0, cors_1.default)());
    }
    //routes method
    routes() {
        this.app.use('/api/users', require('../routes/user.routes'));
    }
    ;
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Rest Server with typescript is running on port ${this.port}`);
        }).on('error', (err) => {
            console.log(err);
        });
    }
}
exports.Server = Server;
