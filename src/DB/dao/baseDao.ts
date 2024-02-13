import { FilterQuery, Model, ObjectId, UpdateQuery } from 'mongoose';

import { IPopulate } from '../../helpers';

// Base DAO
export default abstract class BaseDAO<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(entity: T | T[]) {
    return await this.model.create(entity);
  }

  async getOneById(id: string, select: string = '', useLean: boolean = true): Promise<T | null> {
    return await this.model.findById(id).select(select).lean(useLean);
  }

  async getOneByIdPopulate(
    id: string | ObjectId,
    populate: IPopulate = { path: '', select: '' },
    select: string = '',
    useLean: boolean = true
  ) {
    return await this.model.findById(id).populate(populate.path, populate.select).select(select).lean(useLean);
  }

  async getOne(filter: FilterQuery<T> = {}, useLean: boolean = true) {
    return await this.model.findOne(filter).lean(useLean);
  }

  async getMany(filter: FilterQuery<T> = {}, select: string = '', useLean: boolean = true) {
    return await this.model.find(filter).select(select).lean(useLean);
  }

  async getManyPopulate(
    filter: FilterQuery<T> = {},
    populate: IPopulate = { path: '', select: '' },
    select: string = '',
    useLean: boolean = true
  ) {
    return await this.model.find(filter).populate(populate.path, populate.select).select(select).lean(useLean);
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
