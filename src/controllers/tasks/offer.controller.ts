import { autoInjectable } from 'tsyringe';

import { OfferService } from '../../services/tasks/offer.service';

@autoInjectable()
class OfferController {
  constructor(private readonly offerService: OfferService) {}
}

export { OfferController };
