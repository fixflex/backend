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
import { TaskerService } from '../../services/users/tasker.service';
let TaskerController = class TaskerController {
    constructor(taskerService) {
        this.taskerService = taskerService;
        this.becomeTasker = asyncHandler((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            let userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            let user = yield this.taskerService.registerAsTasker(userId, req.body);
            if (!user)
                return next(new HttpException(400, 'Something went wrong, please try again later'));
            res.status(200).json({ data: user });
        }));
        this.getTaskerProfile = asyncHandler((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            let userId;
            if (req.params.id)
                userId = req.params.id;
            else
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
            let user = yield this.taskerService.getTaskerProfile(userId);
            if (!user)
                return next(new HttpException(400, 'Something went wrong, please try again later'));
            res.status(200).json({ data: user });
        }));
        this.getListOfTaskers = asyncHandler((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let taskers = yield this.taskerService.getListOfTaskers(req.query);
            if (!taskers)
                return next(new HttpException(400, 'Something went wrong, please try again later'));
            res.status(200).json({ results: taskers.length, taskers });
        }));
        this.updateMyTaskerProfile = asyncHandler((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _c;
            let userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
            let user = yield this.taskerService.updateMyTaskerProfile(userId, req.body);
            if (!user)
                return next(new HttpException(400, 'Something went wrong, please try again later'));
            res.status(200).json({ data: user });
        }));
        this.deleteMyTaskerProfile = asyncHandler((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _d;
            let userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d._id;
            let user = yield this.taskerService.deleteMyTaskerProfile(userId);
            if (!user)
                return next(new HttpException(400, 'Something went wrong, please try again later'));
            res.status(200).json({ data: user });
        }));
    }
};
TaskerController = __decorate([
    autoInjectable(),
    __metadata("design:paramtypes", [TaskerService])
], TaskerController);
export { TaskerController };
