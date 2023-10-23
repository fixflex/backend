var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Router } from 'express';
import { autoInjectable } from 'tsyringe';
import { UserController } from '../../controllers/users/user.controller';
import { authenticateUser } from '../../middleware/auth.middleware';
import { imageUpload } from '../../middleware/uploadImages.middleware';
import { getUserValidator, updateLoggedUserValidator } from '../../middleware/validation';
let UserRoute = class UserRoute {
    constructor(userController) {
        this.userController = userController;
        this.path = '/users';
        this.router = Router();
        this.insitializeRoutes();
    }
    insitializeRoutes() {
        //  Logged in user routes (authenticated)
        this.router
            .route(`${this.path}/me`)
            .get(authenticateUser, this.userController.getMe)
            .patch(authenticateUser, updateLoggedUserValidator, this.userController.updateMe)
            .delete(authenticateUser, this.userController.deleteMe);
        this.router.route(`${this.path}/profile-picture-upload`).patch(imageUpload.single('profilePicture'), this.userController.updateMyProfileImage);
        // Public routes
        this.router.get(`${this.path}/:id`, getUserValidator, this.userController.getUser);
    }
};
UserRoute = __decorate([
    autoInjectable(),
    __metadata("design:paramtypes", [UserController])
], UserRoute);
export { UserRoute };
