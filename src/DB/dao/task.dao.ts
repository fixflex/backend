import { Query } from 'express-serve-static-core';

import { ITask } from '../../interfaces';
import TaskModel from '../models/task.model';
import CommonDAO from './baseDao';

class TaskDao extends CommonDAO<ITask> {
  constructor() {
    super(TaskModel);
  }

  async getTasks(query: Query) {
    const tasks = await TaskModel.find(query)
      .populate('ownerId', 'firstName lastName email profilePicture')
      .populate('taskerId', 'firstName lastName email profilePicture')
      .populate('categories', 'name')
      .populate('chatId', 'messages');

    return tasks;
  }
  // async getTasks(query: Query) {
  //   const tasks = await TaskModel.find( )
  //   return tasks;
  // }
}

export { TaskDao };
