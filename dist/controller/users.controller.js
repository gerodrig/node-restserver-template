"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersDelete = exports.usersPost = exports.usersPut = exports.usersGet = void 0;
const usersGet = (req, res) => {
    //extract params
    const { q, name, apikey, page = 1, limit = 10 } = req.query;
    res.json({
        message: 'Rest API with typescript GET',
        q,
        name,
        apikey,
        page,
        limit
    });
};
exports.usersGet = usersGet;
const usersPut = (req, res) => {
    const { id } = req.params;
    res.json({
        id
    });
};
exports.usersPut = usersPut;
const usersPost = (req, res) => {
    const { name, age } = req.body;
    res.json({
        name,
        age
    });
};
exports.usersPost = usersPost;
const usersDelete = (req, res) => {
    res.json({
        message: 'Rest API with typescript DELETE'
    });
};
exports.usersDelete = usersDelete;
