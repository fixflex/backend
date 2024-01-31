import { Query } from 'express-serve-static-core';

import { QueryBuilder } from '../../helpers';
import { IPagination, ITask } from '../../interfaces';
import TaskModel from '../models/task.model';
import CommonDAO from './baseDao';

class TaskDao extends CommonDAO<ITask> {
  constructor() {
    super(TaskModel);
  }
  // override the getOneById method to populate the userId and offers and don't select the __v and the password

  // async getOneById(id: string) {
  //   //  make nested populate to populate the offers the taskerId for each offer
  //   return await this.model
  //     .findById(id)
  //     .populate({
  //       path: 'offers',
  //       populate: {
  //         path: 'taskId',
  //       },
  //     })
  //     .populate('userId', 'firstName lastName profilePicture')
  //     .select('-__v -password');
  // }

  async getTasks(query: Query) {
    const countDocments = await TaskModel.countDocuments();

    if (!query.status) query.status = { $nin: ['CANCELLED'] };

    let apiFeatures = new QueryBuilder<ITask>(TaskModel.find(), query)
      .filter(['location', 'online', 'maxDistance'])
      .locationFilter()
      .search(['title', 'details'])
      .sort('-location.coordinates')
      .limitFields()
      .paginate(countDocments);

    const pagination: IPagination | undefined = apiFeatures.pagination;
    const tasks = await apiFeatures.mongooseQuery
      .select('-__v  -images  -imageCover  -details')
      .populate('userId', 'firstName lastName  profilePicture');

    return { tasks, pagination };
  }
}

export { TaskDao };
