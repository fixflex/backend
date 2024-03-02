import { UploadApiResponse } from 'cloudinary';
import { Query } from 'express-serve-static-core';
import { autoInjectable } from 'tsyringe';

import { CategoryDao, OfferDao, TaskDao, TaskerDao } from '../DB/dao';
import HttpException from '../exceptions/HttpException';
import { IPopulate } from '../helpers';
import { cloudinaryDeleteImage, cloudinaryUploadImage } from '../helpers/cloudinary';
import { NotificationOptions, OneSignalApiHandler } from '../helpers/onesignal';
import { IPagination, ITask, ITaskService, IUser, OfferStatus, PaymobOrderDetails, TaskStatus } from '../interfaces';
import { PaymentMethod, TransactionType } from '../interfaces/transaction.interface';
import { IOffer } from './../interfaces/offer.interface';
import { PaymobService } from './paymob.service';

@autoInjectable()
class TaskService implements ITaskService {
  constructor(
    private readonly taskDao: TaskDao,
    private readonly categoryDao: CategoryDao,
    private readonly offerDao: OfferDao,
    private readonly taskerDao: TaskerDao,
    private readonly oneSignalApiHandler: OneSignalApiHandler,
    private readonly paymobService: PaymobService
  ) {}

  private taskPopulate: IPopulate = {
    path: 'userId offers reviews',
    select: '-__v -password -active -role',
  };

  createTask = async (task: ITask) => {
    // if there is categoryId, check if it exists
    if (task.categoryId) {
      const category = await this.categoryDao.getOneById(task.categoryId);
      if (!category) throw new HttpException(404, 'Category not found');
    }
    const newTask = await this.taskDao.create(task);
    // send push notification to all taskers where the task is in their service area and the task category is in their categories list

    let query: Query = {
      location: `${task.location.coordinates[0]},${task.location.coordinates[1]}`,
      categories: task.categoryId,
      maxDistance: '60',
    };
    let taskers = await this.taskerDao.getTaskers(query);
    // loop through the taskers and collect their userIds and but them in an array of external_ids to send the push notification to them
    // @ts-ignore // TODO: fix the taskersIds type
    let taskersIds = taskers.taskers.map(tasker => tasker.userId._id.toString());
    // console.log(taskersIds);

    // send push notification to the taskers
    let notificationOptions: NotificationOptions = {
      headings: { en: 'New Task' },
      contents: { en: 'A new task is available' },
      data: { task: task._id }, // send the task id to the tasker to use it to navigate to the task details
      external_ids: taskersIds,
    };

    // let notification =
    await this.oneSignalApiHandler.createNotification(notificationOptions);
    // console.log(notification);

    return newTask;
  };

  getTasks = async (query: Query): Promise<{ tasks: ITask[]; pagination: IPagination | undefined }> => {
    const { tasks, pagination } = await this.taskDao.getTasks(query);
    return { pagination, tasks };
  };

  getTaskById = async (id: string) => {
    let task = await this.taskDao.getOneByIdPopulate(id, this.taskPopulate);
    if (!task) throw new HttpException(404, 'Task not found');
    // console.log('extract time from _id=> ', task._id.getTimestamp());
    // console.log('extract time from _id=> ', task._id.getTimestamp().toISOString());
    return task;
  };

  updateTask = async (id: string, payload: ITask, userId: string) => {
    // check if the user is the owner of the task
    const task = await this.taskDao.getOneById(id);

    if (!task) throw new HttpException(404, 'Task not found');
    // convert the id to string to compare it with the userId
    if (task.userId !== userId?.toString()) throw new HttpException(403, 'unauthorized');

    // check the task status, if it is not open, return an error
    if (task.status !== TaskStatus.OPEN) throw new HttpException(400, 'bad_request');
    const updatedTask = await this.taskDao.updateOneById(id, payload);
    return updatedTask;
  };

  uploadTaskImages = async (id: string, files: { [fieldname: string]: Express.Multer.File[] }, userId: string) => {
    // 1. Check if files are uploaded
    if (!files.imageCover && !files.image) throw new HttpException(400, 'file_not_found');

    // 2. Check if the task exists and the user is the owner of the task
    const task = await this.taskDao.getOneById(id);
    if (!task) throw new HttpException(404, 'Task not found');
    if (task.userId !== userId?.toString()) throw new HttpException(403, 'unauthorized');
    if (task.status !== TaskStatus.OPEN) throw new HttpException(400, 'bad_request');

    let imageCover: UploadApiResponse;
    let images: UploadApiResponse[];
    const updateData: any = {};

    // 3. Upload image cover if provided
    if (files.imageCover) {
      // 3.1 Upload image cover to cloudinary
      imageCover = await cloudinaryUploadImage(files.imageCover[0].buffer, 'task-image');

      // 3.2 Delete the old image cover from cloudinary if it exists
      if (task.imageCover.publicId) await cloudinaryDeleteImage(task.imageCover.publicId);

      // 3.3 Update the task with the new image cover data
      updateData.imageCover = { url: imageCover.secure_url, publicId: imageCover.public_id };
    }

    // 4. Upload images if provided
    if (files.image) {
      // 4.1 Upload each image to cloudinary and store the results
      images = await Promise.all(
        files.image.map(async (img: Express.Multer.File) => await cloudinaryUploadImage(img.buffer, 'task-image'))
      );

      // 4.2 Delete the old images from cloudinary if they exist
      if (task.images.length > 0) {
        await Promise.all(
          task.images.map(async img => {
            if (img.publicId) return await cloudinaryDeleteImage(img.publicId);
          })
        );
      }

      // 4.3 Update the task with the new image data
      updateData.images = images.map(img => {
        return { url: img.secure_url, publicId: img.public_id };
      });
    }

    // 5. Update the task with the new data
    let updatedTask = await this.taskDao.updateOneById(id, updateData);

    // 6. Return the updated task
    return updatedTask;
  };

  deleteTask = async (id: string, userId: string) => {
    const task = await this.taskDao.getOneById(id);
    if (!task) throw new HttpException(404, 'Task not found');
    if (task.userId !== userId?.toString()) throw new HttpException(403, 'unauthorized');
    const deletedTask = await this.taskDao.deleteOneById(id);
    return deletedTask;
  };

  // ==================== offer status ==================== //

  cancelTask = async (id: string, userId: string) => {
    // 1. Check if the task exists
    let task = await this.taskDao.getOneByIdPopulate<{ acceptedOffer: IOffer }>(id, { path: 'acceptedOffer', select: '-__v' }, '', false);
    if (!task) throw new HttpException(404, 'resource_not_found');
    // 2. Check if the user is the owner of the task
    if (task.userId !== userId.toString()) throw new HttpException(403, 'forbidden');
    // 3. Check if the task is not canceled or completed
    if (task.status === TaskStatus.CANCELLED || task.status === TaskStatus.COMPLETED) throw new HttpException(400, 'bad_request');
    // 4. Check if the task status is ASSIGNED
    if (task.status === TaskStatus.ASSIGNED) {
      // 4.1. Notify the tasker that the task is canceled
      let tasker = await this.taskerDao.getOneById(task.acceptedOffer!.taskerId, '', false);
      // console.log(tasker);
      let notificationOptions: NotificationOptions = {
        headings: { en: 'Task Canceled' },
        contents: { en: 'The task is canceled' },
        data: { task: task._id },
        external_ids: [tasker!.userId],
      };
      // let notification =
      await this.oneSignalApiHandler.createNotification(notificationOptions);
      // console.log(notification);
      // 4.2 check if the paid field is true, try to void the transaction if the it in the same day if not refund the payment and change the paid field to false and the paymentMethod to CASH
      if (task.paid) {
        // 1. Get the transaction using paymob service
        let transaction = await this.paymobService.getTransactionInquiry(task._id.toString());
        // let transaction = await this.paymobService.getTransactionInquiry('57365dd7c7e564c2af317434e16');
        if (!transaction) throw new HttpException(404, 'transaction_not_found');

        // 2. check if the transaction can be voided, if the transaction is in the same day void it, if not refund it
        let refundOrVoid;
        if (new Date(transaction.created_at).toDateString() === new Date().toDateString()) {
          // 2.1 void the transaction
          refundOrVoid = await this.paymobService.voidTransaction(transaction.id);
          console.log('voidResponse ====================> ', refundOrVoid);
        } else {
          // 2.2 refund the transaction and deduct 1.75% from the amount as a refund fee and send the rest to the user

          refundOrVoid = await this.paymobService.refundTransaction(
            transaction.id,
            Math.round(transaction.amount_cents - transaction.amount_cents * (1.75 / 100))
          );
          console.log('refundResponse ====================> ', refundOrVoid);
        }

        await this.paymobService.handleTransactionWebhook(refundOrVoid, '');
        // change the paid field to false
        // task.paid = false;
        // change the paymentMethod to CASH
        // task.paymentMethod = PaymentMethod.CASH;
      }
    }
    // 5. Update the task status to CANCELED
    task.status = TaskStatus.CANCELLED;
    task.taskerId = null;
    return await task.save();
  };

  openTask = async (id: string, userId: string) => {
    // 1. Check if the task exists
    let task = await this.taskDao.getOneByIdPopulate<{ acceptedOffer: IOffer }>(id, { path: 'acceptedOffer', select: '-__v' }, '', false);
    if (!task) throw new HttpException(404, 'resource_not_found');
    // 2. Check if the user is the owner of the task
    if (task.userId !== userId.toString()) throw new HttpException(403, 'forbidden');
    // 3. Check if the task is not completed or
    if (task.status === TaskStatus.COMPLETED || task.status === TaskStatus.CANCELLED) throw new HttpException(400, 'bad_request');
    // 4. if the task is ASSIGNED then remove the acceptedOffer and update the task status to OPEN and update the offers status to PENDING instead of ACCEPTED
    if (task.status === TaskStatus.ASSIGNED) {
      // 4.1 change the offer status to PENDING
      await this.offerDao.updateOneById(task.acceptedOffer._id.toString(), { status: OfferStatus.PENDING });
      // 4.2 notify the tasker that the task is open
      let tasker = await this.taskerDao.getOneById(task.acceptedOffer.taskerId, '', false);
      let notificationOptions: NotificationOptions = {
        headings: { en: 'Task Canceled' },
        contents: { en: 'The task is canceled' },
        data: { task: task._id },
        external_ids: [tasker!.userId],
      };
      // let notification =
      await this.oneSignalApiHandler.createNotification(notificationOptions);
      // console.log(notification);
      // 4.3 check if the paid field is true, try to void the transaction if the it in the same day if not refund the payment and change the paid field to false and the paymentMethod to CASH
      if (task.paid) {
        // 1. Get the transaction using paymob service
        let transaction = await this.paymobService.getTransactionInquiry(task._id.toString());
        // let transaction = await this.paymobService.getTransactionInquiry('57365dd7c7e564c2af317434e16');
        if (!transaction) throw new HttpException(404, 'transaction_not_found');
        // 2. check if the transaction can be voided, if the transaction is in the same day void it, if not refund it
        let refundOrVoid;
        if (new Date(transaction.created_at).toDateString() === new Date().toDateString()) {
          // 2.1 void the transaction
          refundOrVoid = await this.paymobService.voidTransaction(transaction.id);
          // console.log('voidResponse ====================> ', refundOrVoid);
        } else {
          // 2.2 refund the transaction and deduct 1.75% from the amount as a refund fee and send the rest to the user
          refundOrVoid = await this.paymobService.refundTransaction(
            transaction.id,
            Math.round(transaction.amount_cents - transaction.amount_cents * (1.75 / 100))
          );
          // console.log('refundResponse ====================> ', refundOrVoid);
        }

        await this.paymobService.handleTransactionWebhook(refundOrVoid, '');
        // change the paid field to false
        task.paid = false;
        // change the paymentMethod to CASH
        task.paymentMethod = PaymentMethod.CASH;
      }
      // await this.offerDao.updateMany({ _id: { $in: task.offers } }, { status: OfferStatus.PENDING });
    }
    // @ts-ignore
    task.acceptedOffer = undefined;
    task.status = TaskStatus.OPEN;
    task.taskerId = null;

    await task.save();

    return task;
  };
  // TODO: send number to tasker and this number the user should use it to can make review
  completeTask = async (id: string, userId: string) => {
    // Step 1: Check if the task exists
    const task = await this.taskDao.getOneByIdPopulate<{ acceptedOffer: IOffer }>(id, { path: 'acceptedOffer', select: '-__v' }, '', false);
    if (!task) throw new HttpException(404, 'resource_not_found');

    // Step 2: Check if the user is the owner of the task
    if (task.userId !== userId.toString()) throw new HttpException(403, 'forbidden');

    // Step 3: Check if the task is assigned to a tasker and not completed or canceled
    if (task.status === TaskStatus.CANCELLED || task.status === TaskStatus.COMPLETED)
      throw new HttpException(400, 'task is already completed or canceled');
    if (task.status !== TaskStatus.ASSIGNED) throw new HttpException(400, 'bad_request');

    // Step 4: Get the tasker who has the accepted offer
    const tasker = await this.taskerDao.getOneById(task.acceptedOffer.taskerId, '', false);
    if (!tasker) throw new HttpException(404, 'resource_not_found');

    // Step 5: Handle the task payment method
    const commission: number = parseFloat((task.acceptedOffer.price * tasker.commissionRate).toFixed(2));
    task.commission = commission;
    // Step 5.1: If the payment method is CASH, calculate the commission and add the task to the tasker's notPaidTasks
    if (task.paymentMethod === PaymentMethod.CASH) {
      tasker.notPaidTasks.push(task._id);
    }
    // TODO: Implement online payment method
    // Step 5.2: If the payment method is ONLINE, update the balance of the tasker and the tasker's earnings and completed tasks
    if (task.paymentMethod === PaymentMethod.ONLINE_PAYMENT) {
      // 1. update the tasker's balance where the tasker's balance = tasker's balance + task price - commission
      tasker.balance += task.acceptedOffer.price - task.commission;
    }
    // Step 6: Update tasker's earnings and completed tasks
    tasker.totalEarnings += task.acceptedOffer.price;
    tasker.netEarnings = (tasker.netEarnings || 0) + (task.acceptedOffer.price - task.commission);
    tasker.completedTasks.push(task._id.toString());

    // Step 7: Update task status to COMPLETED
    task.status = TaskStatus.COMPLETED;
    // console.log(tasker.userId, task.userId);
    // Step 8: Save changes and return the updated task
    await Promise.all([task.save(), tasker.save()]);
    // Step 9.1 Send push notification to the tasker that the task is completed and the payment is pending
    let notificationOptionsTasker: NotificationOptions = {
      headings: { en: 'Task Completed' },
      contents: { en: 'The task is completed and the payment is pending' },
      data: { task: task._id },
      external_ids: [tasker.userId],
    };
    // 9.2 Send push notification to the task owner that the task is completed and the payment is pending , thank him for using the app and ask him to rate the tasker, rate the app and share the app with his friends , rate the tasker and the app and share the app with his friends
    let notificationOptionsUser: NotificationOptions = {
      headings: { en: 'Task Completed' },
      contents: { en: 'Thank you for using the app' },
      data: { task: task._id }, // send the task id to the user to use it to navigate to the task details, Note: this data will not appear in the notification but it will be sent with the notification
      external_ids: [task.userId],
    };
    // wait for both notifications to be sent and log the results
    let [notificationTasker, notificationUser] = await Promise.all([
      this.oneSignalApiHandler.createNotification(notificationOptionsTasker),
      this.oneSignalApiHandler.createNotification(notificationOptionsUser),
    ]);
    console.log(notificationTasker, notificationUser);
    return task;
  };

  checkoutTask = async (id: string, user: IUser, payload: any) => {
    // step 1: get the task by id and populate the acceptedOffer field
    let task = await this.taskDao.getOneByIdPopulate<{ acceptedOffer: IOffer }>(id, { path: 'acceptedOffer', select: '-__v' }, '', false);
    // step 2: check if the task exists & there is an accepted offer
    if (!task) throw new HttpException(404, 'resource_not_found');
    if (!task.acceptedOffer) throw new HttpException(400, 'You have to accept an offer first');
    // step 3: check if the user is the owner of the task
    if (task.userId !== user._id.toString()) throw new HttpException(403, 'forbidden');
    // step 4: check if the task is not completed, canceled or open (it should be assigned)
    if (task.status !== TaskStatus.ASSIGNED) throw new HttpException(400, 'bad_request');
    // step 5: create the order additonal data
    let orderDetails: PaymobOrderDetails = {
      taskId: task._id.toString(),
      taskerId: task.acceptedOffer.taskerId,
      amount: task.acceptedOffer.price,
      user,
      transactionType: TransactionType.ONLINE_TASK_PAYMENT,
      phoneNumber: payload.phoneNumber,
    };

    // step 6: check if the payment method in the payload is wallet
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
  };
}

export { TaskService };
