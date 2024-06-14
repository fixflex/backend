import { UploadApiResponse } from 'cloudinary';
import { Query } from 'express-serve-static-core';
import { autoInjectable } from 'tsyringe';

import { CategoryDao, CouponDao, TaskDao } from '../DB/dao';
import { TaskerDao } from '../DB/dao';
import HttpException from '../exceptions/HttpException';
import { cloudinaryDeleteImage, cloudinaryUploadImage } from '../helpers/cloudinary';
import { IPagination, IUser, PaymobOrderDetails } from '../interfaces';
import { ITasker, ITaskerService } from '../interfaces/tasker.interface';
import { TransactionType } from '../interfaces/transaction.interface';
import { PaymobService } from './paymob.service';

@autoInjectable()
class TaskerService implements ITaskerService {
  constructor(
    private readonly categoryDao: CategoryDao,
    private readonly taskerDao: TaskerDao,
    private readonly couponeDao: CouponDao,
    private readonly taskDao: TaskDao,
    private readonly paymobService: PaymobService
  ) {}
  async createTasker(userId: string, tasker: ITasker) {
    // check if service is exists in DB
    await Promise.all(
      tasker.categories.map(async service => {
        let serviceExists = await this.categoryDao.getOneById(service);
        if (!serviceExists) throw new HttpException(404, 'category_not_found');
        return service;
      })
    );

    tasker.userId = userId;
    return await this.taskerDao.create(tasker);
  }

  async getTasker(taskerId: string) {
    return await this.taskerDao.getTaskerProfile(taskerId);
  }

  async getMyProfile(userId: string) {
    return await this.taskerDao.getOnePopulate({ userId }, { path: 'reviews', select: '-__v' });
  }

  async getTaskers(reqQuery: Query): Promise<{ taskers: ITasker[]; pagination: IPagination | undefined }> {
    const { taskers, pagination } = await this.taskerDao.getTaskers(reqQuery);
    return { pagination, taskers };
  }

  async updateTasker(userId: string, tasker: Partial<ITasker>) {
    if (tasker.categories)
      await Promise.all(
        tasker.categories.map(async service => {
          let serviceExists = await this.categoryDao.getOneById(service);
          if (!serviceExists) throw new HttpException(404, 'category_not_found');
          return service;
        })
      );

    return await this.taskerDao.updateOne({ userId }, tasker);
  }

  async updateProfileImages(userId: string, files: { [fieldname: string]: Express.Multer.File[] }) {
    if (!files.image) throw new HttpException(400, 'file_not_found');

    let tasker = await this.taskerDao.getOne({ userId });
    if (!tasker) throw new HttpException(404, 'tasker_not_found');
    let images: UploadApiResponse[];
    const updateData: any = {};
    // 1. upload images if exists
    if (files.image) {
      // 1.1 upload images to cloudinary and get the urls
      images = await Promise.all(
        files.image.map(async (img: Express.Multer.File) => await cloudinaryUploadImage(img.buffer, 'tasker-portfolio'))
      );

      // 1.2 delete old images from cloudinary
      if (tasker.portfolio.length > 0) {
        await Promise.all(
          tasker.portfolio.map(async img => {
            if (img.publicId) return await cloudinaryDeleteImage(img.publicId);
          })
        );
      }

      updateData.portfolio = images.map(img => {
        return { url: img.secure_url, publicId: img.public_id };
      });
    }
    // @ts-ignore
    let updatedTasker = await this.taskerDao.updateOneById(tasker._id, updateData);

    return updatedTasker;
  }

  async deleteTasker(userId: string) {
    return await this.taskerDao.deleteOne({ userId });
  }

  async applyCoupon(userId: string, couponCode: string) {
    // step 1: check user is tasker
    let tasker = await this.taskerDao.getOne({ userId }, false);
    if (!tasker) throw new HttpException(404, 'tasker_not_found');
    // step 2: check coupon is exists & valid
    let coupon = await this.couponeDao.getOne({ code: couponCode, expirationDate: { $gte: new Date() }, remainingUses: { $gt: 0 } }, false);
    if (!coupon) throw new HttpException(404, 'coupon_not_found_or_expired');
    // step 3: apply coupon to tasker
    tasker.notPaidTasks.forEach(async taskId => {
      let task = await this.taskDao.getOneById(taskId, '', false);
      if (task) {
        task.commissionAfterDescount = task.commission - (task.commission * coupon!.value) / 100;
        if (task.commissionAfterDescount <= 0) {
          // remove task from notPaidTasks
          tasker!.notPaidTasks = tasker!.notPaidTasks.filter(t => t != taskId);
          await Promise.all([task.save(), tasker!.save()]);
        } else await task.save();
      }
    });
    coupon.remainingUses--;
    await coupon.save();
    return true;
  }

  // ====================== payment ====================== //

  async checkout(user: IUser, payload: any) {
    let tasker = await this.taskerDao.getOne({ userId: user._id }, false);
    if (!tasker) throw new HttpException(404, 'tasker_not_found');
    let totalCommissions = 0;
    const totalCommissionsPromises = tasker.notPaidTasks.map(async taskId => {
      let task = await this.taskDao.getOneById(taskId);
      if (task) {
        return task.commissionAfterDescount ? task.commissionAfterDescount : task.commission;
      }
      return 0; // return 0 if task is not found
    });

    // wait for all promises to resolve and get the total commissions
    totalCommissions = (await Promise.all(totalCommissionsPromises)).reduce((a, b) => a + b, 0); // a is the accumulator and  b is the current value of array's element 0 is the initial value of the accumulator

    // i want to generat 6 rundom numbers and add the tasker id to it to make it unique :

    let orderDetails: PaymobOrderDetails = {
      user,
      amount: totalCommissions,
      taskId: '',
      taskerId: `${Math.floor(100000 + Math.random() * 90000)}-${tasker._id.toString()}`,
      transactionType: TransactionType.COMMISSION_PAYMENT,
      phoneNumber: payload.phoneNumber ? payload.phoneNumber : user.phoneNumber,
      merchant_order_id: tasker._id.toString(),
    };

    if (totalCommissions <= 0) throw new HttpException(400, 'no_commissions_to_pay');

    let paymentLink: string = '';
    if (payload.paymentMethod === 'wallet') {
      // step 6.1: check if there phone number in the payload object
      if (!payload.phoneNumber) throw new HttpException(400, 'phone_number_required');
      // step 6.2: call the paymob service to create the order and get the payment key

      paymentLink = await this.paymobService.initiateWalletPayment(orderDetails);
      console.log('paymentLink ====================> ', paymentLink);
      // step 6.3: return the payment link
      return paymentLink;
    } else if (payload.paymentMethod === 'card') {
      // step 6.4: call the paymob service to create the order and get the payment key

      paymentLink = await this.paymobService.initiateCardPayment(orderDetails);
      console.log('paymentLink ====================> ', paymentLink);
      // step 6.5: return the payment link
      return paymentLink;
    }

    throw new HttpException(400, 'invalid_payment_method');
  }
}

export { TaskerService };
