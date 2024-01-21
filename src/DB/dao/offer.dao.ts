import { IOffer } from '../../interfaces';
import OfferModel from '../models/offer.model';
import CommonDAO from './baseDao';

class OfferDao extends CommonDAO<IOffer> {
  constructor() {
    super(OfferModel);
  }
}

export { OfferDao };
