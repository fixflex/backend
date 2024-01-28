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
      .search(['bio'])
      .sort()
      .limitFields()
      .paginate(countDocments);

    const pagination: IPagination | undefined = apiFeatures.pagination;
    const taskers = await apiFeatures.mongooseQuery
      .select('-__v  -availability  -isVerified -workingHours  -categories  -phoneNumber  -location')
      .populate('userId', 'firstName lastName  profilePicture');

    return { taskers, pagination };
  }

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
