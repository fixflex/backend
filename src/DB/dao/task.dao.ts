import { ITask } from '../../interfaces';
import TaskModel from '../models/task.model';
import CommonDAO from './commonDAO';

class TaskDao extends CommonDAO<ITask> {
  constructor() {
    super(TaskModel);
  }
}

export { TaskDao };
