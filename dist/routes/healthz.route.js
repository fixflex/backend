"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customResponse_1 = __importDefault(require("../helpers/customResponse"));
class HealthzRoute {
    constructor() {
        this.path = '/healthz';
        this.router = (0, express_1.Router)();
        this.initializerRoutes();
    }
    initializerRoutes() {
        this.router.get(`${this.path}`, (_req, res) => {
            // console.log(_req.cookies.healthz);
            res.status(200).json((0, customResponse_1.default)({ data: null, success: true, status: 200, message: 'Welcome to Rest API - 👋🌎🌍🌏', error: false }));
        });
        this.router.get('/', (_req, res) => {
            // log request cookies
            // console.log('Cookies: ', _req.cookies);
            // res.cookie('TestAccessToken', 'token', {
            //   httpOnly: true, // client side js cannot access the cookie
            //   maxAge: 24 * 60 * 60 * 1000, // one days
            //   secure: process.env.NODE_ENV === 'production', // cookie only works in https
            //   // privent cross-site access to the cookie (only allow same site access)
            //   sameSite: 'strict', // cross-site access not allowed
            // });
            // console.log(_req.cookies.healthz);
            // res.cookie('healthz', 'token_healthz', {
            //   // httpOnly: true, // client side js cannot access the cookie
            //   // maxAge: 24 * 60 * 60 * 1000, // one days
            //   // secure: process.env.NODE_ENV === 'production', // cookie only works in https
            //   secure: false, // cookie only works in https
            //   // sameSite: 'lax', // cross-site access not allowed
            //   path: '/api/v1/healthz',
            // });
            res.status(200).json((0, customResponse_1.default)({ data: null, success: true, status: 200, message: 'Welcome to Rest API - 👋🌎🌍🌏', error: false }));
        });
    }
}
exports.default = HealthzRoute;
