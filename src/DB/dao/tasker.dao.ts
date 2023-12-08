import { ITasker } from '../../interfaces/user.interface';
import TaskerModel from '../models/user/tasker.model';
import CommonDAO from './commonDAO';

class TaskerDao extends CommonDAO<ITasker> {
  constructor() {
    super(TaskerModel);
  }
  async listTaskers(longitude: number, latitude: number, services: string, maxDistance: number = 60): Promise<ITasker[] | null> {
    let taskers: ITasker[];
    // /api/v1/taskers?longitude=35.5&latitude=33.5&services=6560fabd6f972e1d74a71242&maxDistance=60
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
      })
        .populate('userId', 'firstName lastName email  profilePicture')
        .populate('services', 'name')
        .lean();
    } else if (services) {
      taskers = await TaskerModel.find({
        // where services = service
        services: { $eq: services },
      })
        .populate('userId', 'firstName lastName email  profilePicture')
        .populate('services', 'name')
        .lean();
    } else if (latitude && longitude) {
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
      })
        .populate('userId', 'firstName lastName email  profilePicture')
        .populate('services', 'name')
        .lean();
    } else taskers = await TaskerModel.find({}).populate('userId', 'firstName lastName email  profilePicture').populate('services', 'name').lean();

    return taskers;
  }

  // get tasker profile with user data and services data
  async getTaskerProfile(taskerId: string): Promise<ITasker | null> {
    let tasker = await TaskerModel.findById(taskerId).populate('userId', 'firstName lastName email profilePicture').populate('services', '_id name').lean();
    return tasker;
  }
}

export default TaskerDao;
