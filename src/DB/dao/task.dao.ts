import { Query } from 'express-serve-static-core';

import { QueryBuilder } from '../../helpers';
import { IPagination, ITask } from '../../interfaces';
import TaskModel from '../models/task.model';
import CommonDAO from './baseDao';

class TaskDao extends CommonDAO<ITask> {
  constructor() {
    super(TaskModel);
  }

  async getTasks(query: Query) {
    const countDocments = await TaskModel.countDocuments();

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
      .populate('ownerId', 'firstName lastName  profilePicture');

    return { tasks, pagination };
  }
}

export { TaskDao };

// async getTasks(query: Query) {
//   const tasks = await TaskModel.find( )
//   return tasks;

// }
// const tasks = await TaskModel.find(query);
// // .populate('ownerId', 'firstName lastName email profilePicture')
// // .populate('taskerId', 'firstName lastName email profilePicture')
// // .populate('categories', 'name')
// // .populate('chatId', 'messages');
