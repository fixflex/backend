import { ITasker } from '../../interfaces/user.interface';
import TaskerModel from '../models/user/tasker.model';

class TaskerDao {
  async getUserByUsername(emailOrUsername: string): Promise<ITasker | null> {
    return await TaskerModel.findOne({ username: emailOrUsername }).lean();
  }

  async getUserByEmail(emailOrUsername: string): Promise<ITasker | null> {
    return await TaskerModel.findOne({ email: emailOrUsername }).lean();
  }

  async getUserById(userId: string): Promise<ITasker | null> {
    return await TaskerModel.findById(userId).lean();
  }

  async listUsers(query: any = {}, paginate: { skip: number; limit: number }, sort: any = {}, select: any = '-__v'): Promise<ITasker[]> {
    // build the query
    let users = TaskerModel.find(query);
    if (paginate.skip) users = users.skip(paginate.skip);
    if (paginate.limit) users = users.limit(paginate.limit);
    users = users.sort(sort).select(select);
    // execute the query
    return await users.lean();
  }

  async create(user: ITasker): Promise<ITasker> {
    return await TaskerModel.create(user);
  }

  async update(userId: string, user: ITasker): Promise<ITasker | null> {
    return await TaskerModel.findByIdAndUpdate(userId, user, { new: true }).lean();
  }

  async delete(userId: string): Promise<ITasker | null> {
    return await TaskerModel.findByIdAndDelete(userId).lean();
  }
}

export default TaskerDao;
