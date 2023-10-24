import { ITasker } from '../../interfaces/user.interface';
import TaskerModel from '../models/user/tasker.model';

class TaskerDao {
  static async getTaskerByUserId(userId: string): Promise<ITasker | null> {
    return await TaskerModel.findOne({ userId }).lean();
  }

  static async listTaskers(longitude: number, latitude: number, services: string, maxDistance: number = 60): Promise<ITasker[] | null> {
    let taskers: ITasker[];
    if (latitude && longitude && services) {
      taskers = await TaskerModel.find({
        location: {
          $near: {
            $maxDistance: maxDistance * 1000, // convert km to meters (mongodb uses meters) it is 60km by default
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude], // [longitude, latitude] [x, y]
            },
          },
        },
        // where services = service
        services: { $eq: services },
      }).lean();
    } else taskers = await TaskerModel.find({}).lean();

    return taskers;
  }

  static async create(user: ITasker): Promise<ITasker | null> {
    return await TaskerModel.create(user);
  }

  static async updateTaskerByUserId(userId: string, tasker: ITasker): Promise<ITasker | null> {
    if (tasker.services) {
      // let services = tasker.services;
      // delete tasker.services;
      const { services, ...taskerWithoutServices } = tasker;
      return await TaskerModel.findOneAndUpdate({ userId }, { $addToSet: { services }, ...taskerWithoutServices }, { new: true }).lean();
    }
    return TaskerModel.findOneAndUpdate({ userId }, tasker, { new: true }).lean();
  }

  static async deleteTaskerByUserId(userId: string): Promise<ITasker | null> {
    return await TaskerModel.findOneAndDelete({ userId }).lean();
  }
}

export default TaskerDao;
