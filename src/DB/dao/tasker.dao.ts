import { Query } from 'express-serve-static-core';

import { QueryBuilder } from '../../helpers';
import { IPagination } from '../../interfaces';
import { ITasker } from '../../interfaces/tasker.interface';
import TaskerModel from '../models/tasker.model';
import CommonDAO from './baseDao';

class TaskerDao extends CommonDAO<ITasker> {
  constructor() {
    super(TaskerModel);
  }

  async getTaskers(query: Query) {
    const countDocments = await TaskerModel.countDocuments();

    let apiFeatures = new QueryBuilder<ITasker>(TaskerModel.find(), query)
      .filter(['location', 'maxDistance'])
      .locationFilter()
      .search(['title', 'details'])
      .sort()
      .limitFields()
      .paginate(countDocments);

    const pagination: IPagination | undefined = apiFeatures.pagination;
    const taskers = await apiFeatures.mongooseQuery
      .select('-__v  -availability  -isVerified -workingHours  -categories  -phoneNumber  -location')
      .populate('userId', 'firstName lastName  profilePicture');

    return { taskers, pagination };
  }

  // async listTaskers(longitude: number, latitude: number, categories: string, maxDistance: number = 60): Promise<ITasker[] | null> {
  //   let taskers: ITasker[];
  //   // /api/v1/taskers?longitude=35.5&latitude=33.5&categories=6560fabd6f972e1d74a71242&maxDistance=60
  //   if (latitude && longitude && categories) {
  //     taskers = await TaskerModel.find({
  //       location: {
  //         $near: {
  //           $maxDistance: maxDistance * 1000, // convert km to meters (mongodb uses meters) it is 60km by default
  //           $geometry: {
  //             type: 'Point',
  //             coordinates: [longitude, latitude], // [longitude, latitude] [y, x]
  //           },
  //         },
  //       },
  //       // where categories = service
  //       categories: { $eq: categories },
  //     })
  //       .populate('userId', 'firstName lastName email  profilePicture')
  //       .populate('categories', 'name')
  //       .lean();
  //   } else if (categories) {
  //     taskers = await TaskerModel.find({
  //       // where categories = service
  //       categories: { $eq: categories },
  //     })
  //       .populate('userId', 'firstName lastName email  profilePicture')
  //       .populate('categories', 'name')
  //       .lean();
  //   } else if (latitude && longitude) {
  //     taskers = await TaskerModel.find({
  //       location: {
  //         $near: {
  //           $maxDistance: maxDistance * 1000, // convert km to meters (mongodb uses meters) it is 60km by default
  //           $geometry: {
  //             type: 'Point',
  //             coordinates: [longitude, latitude], // [longitude, latitude] [x, y]
  //           },
  //         },
  //       },
  //     })
  //       .populate('userId', 'firstName lastName email  profilePicture')
  //       .populate('categories', 'name')
  //       .lean();
  //   } else
  //     taskers = await TaskerModel.find({})
  //       .populate('userId', 'firstName lastName email  profilePicture')
  //       .populate('categories', 'name')
  //       .lean();

  //   return taskers;
  // }

  // get tasker profile with user data and categories data
  async getTaskerProfile(taskerId: string): Promise<ITasker | null> {
    let tasker = await TaskerModel.findById(taskerId)
      .populate('userId', 'firstName lastName email profilePicture')
      .populate('categories', '_id name')
      .lean();
    return tasker;
  }
}

export default TaskerDao;
