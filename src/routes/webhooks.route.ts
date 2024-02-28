import { Router } from 'express';
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
    this.router.post(`${this.path}/paymob`, async (req, res) => {
      let results = await this.paymobService.handleTransactionWebhook(req.body.obj, req.query.hmac);
      res.status(200).json({ results });
    });

    this.router.get(`${this.path}/paymob`, async (req, res) => {
      res.status(200).json({ message: 'success', data: req.query });
    });
  }
}

export { WebhooksRoute };
