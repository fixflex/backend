import { FilterQuery, Model, ObjectId, UpdateQuery } from 'mongoose';

// common DAO
export default abstract class CommonDAO<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(entity: T | T[]) {
    return await this.model.create(entity);
  }

  async getOneById(id: string | ObjectId, useLean: boolean = true) {
    return await this.model.findById(id).select('-password -__v -role').lean(useLean);
  }

  async getMany(filter: FilterQuery<T> = {}, useLean: boolean = true) {
    return await this.model.find(filter).lean(useLean);
  }

  async updateOneById(id: string | ObjectId, payload: UpdateQuery<T>) {
    return await this.model.findByIdAndUpdate(id, payload, { new: true }).select('-password -__v -role').lean();
  }

  async updateMany(filter: FilterQuery<T>, payload: UpdateQuery<T>) {
    await this.model.updateMany(filter, payload); // updateMany don't return the updated documents
    return await this.model.find(filter).lean();
  }

  async deleteOneById(id: string | ObjectId) {
    return await this.model.findByIdAndDelete(id).lean();
  }

  //   async deleteMany(filter: FilterQuery<T>) {
  //     return await this.model.deleteMany(filter).lean();
  //   }
}
