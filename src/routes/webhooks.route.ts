import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { autoInjectable } from 'tsyringe';

import { PaymobService } from '../services/paymob.service';

@autoInjectable()
class WebhooksRoute {
  public path = '/webhooks';
  public router = Router();

  constructor(private paymobService: PaymobService) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/paymob`,
      asyncHandler(async (req, res) => {
        let results;
        if (!req.body.obj.is_voided && !req.body.obj.is_refunded) {
          // console.log('webhook ======++++++>', req.body.obj);
          results = await this.paymobService.handleTransactionWebhook(req.body.obj, req.query.hmac);
        }
        res.status(200).json({ results });
      })
    );
    this.router.get(`${this.path}/paymob/success`, async (req, res) => {
      res.status(200).json({ message: 'success', data: req.query });
    });
  }
}

export { WebhooksRoute };
