import { Query } from 'express-serve-static-core';

import { QueryBuilder } from '../../helpers';
import { IPagination, ITask } from '../../interfaces';
import TaskModel from '../models/task.model';
import CommonDAO from './base.dao';

class TaskDao extends CommonDAO<ITask> {
  constructor() {
    super(TaskModel);
  }
  // override the getOneById method to populate the userId and offers and don't select the __v and the password

  async getTaskById(id: string) {
    //  make nested populate to populate the offers the taskerId for each offer
    return await this.model
      .findById(id)
      // .select('title userId')
      .populate({
        path: 'offers',
        select: '-__v',
        populate: {
          path: 'taskerId',
          select: 'ratingAverage ratingQuantity',
          populate: {
            path: 'userId',
            select: 'firstName lastName profilePicture',
          },
        },
      })
      .populate('userId', 'firstName lastName profilePicture')
      .select('-__v');
  }

  async getTasks(query: Query) {
    // console.log(query);
    const countDocments = await TaskModel.countDocuments();

    if (!query.status && !query.userId) query.status = { $nin: ['CANCELLED'] };

    let apiFeatures = new QueryBuilder<ITask>(TaskModel.find(), query)
      .filter(['location', 'online', 'maxDistance'])
      .locationFilter()
      .search(['title', 'details'])
      .sort('-location.coordinates')
      .limitFields()
      .paginate(countDocments);

    const pagination: IPagination | undefined = apiFeatures.pagination;
    const tasks = await apiFeatures.mongooseQuery
      // TODO: Make apiFeatures more generic to handle all the populate and select methods , by removing the select and populate methods from the apiFeatures and make them as a method in the QueryBuilder class
      .select('-__v  -images  -imageCover  -details')
      .populate('userId', 'firstName lastName  profilePicture');

    return { tasks, pagination };
  }
}

export { TaskDao };
