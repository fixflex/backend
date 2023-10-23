var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';
import { AuthServie } from '../services/auth.service';
// TODO: use passport.js for authentication
// TODO: refresh token and logout routes
export let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.signup = asyncHandler((req, res) => __awaiter(this, void 0, void 0, function* () {
            let { user, token } = yield this.authService.signup(req.body);
            const userData = { _id: user._id, email: user.email };
            res.status(201).json({ data: userData, token });
        }));
        this.login = asyncHandler((req, res) => __awaiter(this, void 0, void 0, function* () {
            let { email, password } = req.body;
            let { user, token } = yield this.authService.login(email, password);
            const userData = { _id: user._id, email: user.email };
            res.status(200).json({ data: userData, token });
        }));
    }
};
AuthController = __decorate([
    autoInjectable(),
    __metadata("design:paramtypes", [AuthServie])
], AuthController);
