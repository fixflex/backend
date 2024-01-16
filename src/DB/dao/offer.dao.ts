import { IOffer } from '../../interfaces';
import OfferModel from '../models/offer.model';
import CommonDAO from './commonDAO';

class OfferDao extends CommonDAO<IOffer> {
  constructor() {
    super(OfferModel);
  }
}

export { OfferDao };
