// import { Router } from 'express';
// import { autoInjectable } from 'tsyringe';

// import { UserController } from '../controllers/user.controller';
// import { Routes } from '../interfaces/routes.interface';
// import { allowedTo, authenticateUser } from '../middleware/auth.middleware';
// import {
//   createUserValidator,
//   deleteUserValidator,
//   getUserValidator,
//   updateUserValidator,
// } from '../middleware/validation';

// class AdminRoute implements Routes {
//   public basePath = '/admin';
//   public userPath = '/admin/users';
//   public router = Router();

//   constructor() {
//     this.initializeRoutes();
//   }

//   private initializeRoutes() {
//     this.router.use(`${this.basePath}`, authenticateUser, allowedTo('admin'));

//     this.router
//       .route(`${this.userPath}`)
//       .get(this.userController.getUsers)
//       .post(createUserValidator, this.userController.createUser);
//     this.router
//       .route(`${this.userPath}/:id`)
//       .patch(updateUserValidator, this.userController.updateUser)
//       .delete(deleteUserValidator, this.userController.deleteUser);
//   }
// }

// export default AdminRoute;
