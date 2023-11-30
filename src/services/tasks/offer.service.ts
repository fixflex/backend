import { autoInjectable } from 'tsyringe';

import { OfferDao } from '../../DB/dao/offer.dao';
import TaskerDao from '../../DB/dao/tasker.dao';
import HttpException from '../../exceptions/HttpException';

@autoInjectable()
class OfferService {
  constructor(private offerDao: OfferDao, private taskerDao: TaskerDao) {}

  async createOffer(offer: any, userId: string | undefined) {
    // check if this user is a tasker
    let tasker = await this.taskerDao.getOne({ userId });
    if (!tasker) throw new HttpException(400, 'You are not a tasker');
    offer.taskerId = tasker._id;
    return await this.offerDao.create(offer);
  }

  async getOfferById(id: string) {
    return await this.offerDao.getOneById(id);
  }

  async getOffers() {
    return await this.offerDao.getMany();
  }

  async updateOffer(id: string, offer: any, userId: string | undefined) {
    // check if this user is a tasker
    let tasker = await this.taskerDao.getOne({ userId });
    if (!tasker) throw new HttpException(400, 'You are not a tasker');
    offer.taskerId = tasker._id;
    return await this.offerDao.updateOneById(id, offer);
  }

  async deleteOffer(id: string, userId: string | undefined) {
    // check if this user is a tasker
    let tasker = await this.taskerDao.getOne({ userId });
    if (!tasker) throw new HttpException(400, 'You are not a tasker');
    return await this.offerDao.deleteOneById(id);
  }
}

export { OfferService };
