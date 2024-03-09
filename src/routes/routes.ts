import { container } from 'tsyringe';

import { UserRoute } from './';
import { AuthRoute } from './';
import { CategoryRoute } from './';
import { MessageRoute } from './';
import { ChatRoute } from './chat.route';
import { CouponRoute } from './coupon.route';
import HealthzRoute from './healthz.route';
import { OfferRoute } from './offer.route';
import { ReviewRoute } from './review.route';
import { TaskRoute } from './task.route';
import { TaskerRoute } from './tasker.route';
import { WebhooksRoute } from './webhooks.route';

// Setup routes
let authRoute = container.resolve(AuthRoute);
let userRoute = container.resolve(UserRoute);
let categoryRoute = container.resolve(CategoryRoute);
let taskerRoute = container.resolve(TaskerRoute);
let healthzRoute = container.resolve(HealthzRoute);
let chatRoute = container.resolve(ChatRoute);
let messageRoute = container.resolve(MessageRoute);
let taskRoute = container.resolve(TaskRoute);
let offerRoute = container.resolve(OfferRoute);
let couponRoute = container.resolve(CouponRoute);
let webhooksRoute = container.resolve(WebhooksRoute);
let reviewRouite = container.resolve(ReviewRoute);

// put all routes in an array and export it

export const routes = [
  healthzRoute,
  authRoute,
  userRoute,
  taskerRoute,
  categoryRoute,
  chatRoute,
  taskRoute,
  offerRoute,
  couponRoute,
  messageRoute,
  webhooksRoute,
  reviewRouite,
];
