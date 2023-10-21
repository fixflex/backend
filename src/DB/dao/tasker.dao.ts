import { ITasker } from '../../interfaces/user.interface';
import TaskerModel from '../models/user/tasker.model';

class TaskerDao {
  async getTaskerByUserId(userId: string): Promise<ITasker | null> {
    return await TaskerModel.findOne({ userId }).lean();
  }

  // async listUsers(query: any = {}, paginate: { skip: number; limit: number }, sort: any = {}, select: any = '-__v'): Promise<ITasker[]> {
  //   // build the query
  //   let users = TaskerModel.find(query);
  //   if (paginate.skip) users = users.skip(paginate.skip);
  //   if (paginate.limit) users = users.limit(paginate.limit);
  //   users = users.sort(sort).select(select);
  //   // execute the query
  //   return await users.lean();
  // }

  async create(user: ITasker): Promise<ITasker | null> {
    return await TaskerModel.create(user);
  }

  async updateTaskerByUserId(userId: string, tasker: ITasker): Promise<ITasker | null> {
    if (tasker.services) {
      // let services = tasker.services;
      // delete tasker.services;
      const { services, ...taskerWithoutServices } = tasker;
      console.log(services);
      return await TaskerModel.findOneAndUpdate({ userId }, { $addToSet: { services }, ...taskerWithoutServices }, { new: true }).lean();
    }
    return TaskerModel.findOneAndUpdate({ userId }, tasker, { new: true }).lean();
  }

  async deleteTaskerByUserId(userId: string): Promise<ITasker | null> {
    return await TaskerModel.findOneAndDelete({ userId }).lean();
  }
}

export default TaskerDao;
