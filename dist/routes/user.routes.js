"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
exports.router = (0, express_1.Router)();
exports.router.get('/', (req, res) => {
    res.json({
        message: 'Rest API with typescript GET'
    });
});
exports.router.put('/', (req, res) => {
    res.json({
        message: 'Rest API with typescript PUT'
    });
});
exports.router.post('/', (req, res) => {
    res.status(206).json({
        message: 'Rest API with typescript POST'
    });
});
exports.router.delete('/', (req, res) => {
    res.json({
        message: 'Rest API with typescript DELETE'
    });
});
