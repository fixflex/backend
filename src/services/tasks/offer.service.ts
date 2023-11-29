import { autoInjectable } from 'tsyringe';

import { OfferDao } from '../../DB/dao/offer.dao';

@autoInjectable()
class OfferService {
  constructor(private readonly offerDao: OfferDao) {}
}

export { OfferService };
