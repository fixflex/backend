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
import HttpException from '../../exceptions/HttpException';
import { UserService } from '../../services/users/user.service';
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
        // public Routes
        this.getUser = asyncHandler((req, res) => __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userService.getUser(req.params.id);
            res.status(200).json({ data: user });
        }));
        // user profile routes (authenticated)
        this.getMe = asyncHandler((req, res) => __awaiter(this, void 0, void 0, function* () {
            res.status(200).json({ data: req.user });
        }));
        this.updateMe = asyncHandler((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            let user = yield this.userService.updateUser((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, req.body);
            res.status(200).json({ data: user });
        }));
        this.deleteMe = asyncHandler((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            yield this.userService.deleteUser((_b = req.user) === null || _b === void 0 ? void 0 : _b._id);
            res.sendStatus(204);
        }));
        this.updateMyProfileImage = asyncHandler((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _c;
            let userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
            if (!req.file)
                return next(new HttpException(400, 'Please upload a file'));
            let user = this.userService.updateProfileImage(userId, req.file);
            if (!user)
                return next(new HttpException(404, 'No user found'));
            res.status(200).json({ data: user });
        }));
    }
};
UserController = __decorate([
    autoInjectable(),
    __metadata("design:paramtypes", [UserService])
], UserController);
export { UserController };
