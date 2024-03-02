import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { TaskController } from '../controllers/task.controller';
import { Request, Response } from '../helpers';
import { Routes } from '../interfaces';
import { authenticateUser } from '../middleware/auth.middleware';
import { isMongoId } from '../middleware/validation/isMongoID.validator';
import { createTaskValidator, updateTaskValidator } from '../middleware/validation/tasks.validator';
import { ReviewRoute } from './review.route';

@autoInjectable()
class TaskRoute implements Routes {
  public path = '/tasks';
  public router = Router();
  constructor(private readonly taskController: TaskController, private readonly reviewRoute: ReviewRoute) {
    this.initializerRoutes();
  }
  private initializerRoutes() {
    // Nested route
    this.router.all(
      `${this.path}/:id/reviews/:reviewId?`, // the ? means that the param is optional
      (req: Request, _res: Response, next) => {
        // Append taskId to req.query
        req.query = {
          ...req.query,
          taskId: req.params.id,
        };

        if (req.method === 'POST') {
          req.body = {
            ...req.body,
            taskId: req.params.id,
          };
        }

        // Remove '/tasks/:id' from req.url
        req.url = req.url.replace(`${this.path}/${req.params.id}`, '');
        next();
      },
      this.reviewRoute.router
    );

    this.router.get(`${this.path}`, this.taskController.getTasks);
    this.router.get(`${this.path}/:id`, isMongoId, this.taskController.getTaskById);
    // this.router.get(`${this.path}/:id/offers`, this.taskController.getTaskOffers);

    // =================================================================== //
    // ====>>>====>>>====>>>  require authentication <<<====<<<====<<<==== //
    // =================================================================== //
    this.router.use(`${this.path}`, authenticateUser);
    this.router.post(`${this.path}`, createTaskValidator, this.taskController.createTask);
    // uplaodTaskImages,
    this.router.patch(`${this.path}/:id`, isMongoId, updateTaskValidator, this.taskController.updateTask);
    this.router.patch(`${this.path}/:id/images`, isMongoId, this.taskController.taskImages, this.taskController.uploadTaskImages);
    // this.router.delete(`${this.path}/:id`, isMongoId, this.taskController.deleteTask);

    // checkout
    this.router.patch(`${this.path}/checkout/:id`, isMongoId, this.taskController.checkoutTask);

    // ==================== offer status ==================== //
    this.router.patch(`${this.path}/:id/open`, isMongoId, this.taskController.openTask);
    this.router.patch(`${this.path}/:id/cancel`, isMongoId, this.taskController.cancelTask);
    this.router.patch(`${this.path}/:id/complete`, isMongoId, this.taskController.completeTask);
  }
}

export { TaskRoute };

// this.router.get(`${this.path}/:id/images`, this.taskController.getTaskImages);
// this.router.get(`${this.path}/:id/owner`, this.taskController.getTaskOwner);
// this.router.get(`${this.path}/:id/tasker`, this.taskController.getTaskTasker);
// this.router.get(`${this.path}/:id/chat`, this.taskController.getTaskChat);
