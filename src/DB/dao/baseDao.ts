import { FilterQuery, Model, ObjectId, UpdateQuery } from 'mongoose';

// Base DAO
export default abstract class BaseDAO<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(entity: T | T[]) {
    return await this.model.create(entity);
  }

  async getOneById(id: string | ObjectId, useLean: boolean = true) {
    return await this.model.findById(id).lean(useLean);
  }

  async getOne(filter: FilterQuery<T> = {}, useLean: boolean = true) {
    return await this.model.findOne(filter).lean(useLean);
  }

  async getMany(filter: FilterQuery<T> = {}, useLean: boolean = true) {
    return await this.model.find(filter).lean(useLean);
  }

  async updateOneById(id: string | ObjectId, payload: UpdateQuery<T>) {
    return await this.model.findByIdAndUpdate(id, payload, { new: true }).lean();
  }

  async updateOne(filter: FilterQuery<T>, payload: UpdateQuery<T>) {
    return await this.model.updateOne(filter, payload, { new: true }).lean();
  }

  async updateMany(filter: FilterQuery<T>, payload: UpdateQuery<T>) {
    await this.model.updateMany(filter, payload); // updateMany don't return the updated documents
    return await this.model.find(filter).lean();
  }

  async deleteOneById(id: string | ObjectId) {
    return await this.model.findByIdAndDelete(id).lean();
  }

  async deleteOne(filter: FilterQuery<T>) {
    return await this.model.deleteOne(filter).lean();
  }

  async deleteMany(filter: FilterQuery<T>) {
    return await this.model.deleteMany(filter).lean();
  }
}
