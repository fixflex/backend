"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Base DAO
class BaseDAO {
    constructor(model) {
        this.model = model;
    }
    async create(entity) {
        return await this.model.create(entity);
    }
    async getOneById(id, select = '', useLean = true) {
        return await this.model.findById(id).select(select).lean(useLean);
    }
    async getOneByIdPopulate(// <T> is the type of the populated field for example:  < filedName: IType > ==>> <taskerId: ITasker>
    id, populate = { path: '', select: '' }, select = '', useLean = true) {
        return await this.model.findById(id).populate(populate.path, populate.select).select(select).lean(useLean);
    }
    async getOne(filter = {}, useLean = true) {
        return await this.model.findOne(filter).lean(useLean);
    }
    async getOnePopulate(// <T> is the type of the populated field for example:  <T> ==>> <ITasker>
    filter = {}, populate = { path: '', select: '' }, select = '', useLean = true) {
        return await this.model.findOne(filter).populate(populate.path, populate.select).select(select).lean(useLean);
    }
    async getMany(filter = {}, select = '', useLean = true) {
        return await this.model.find(filter).select(select).lean(useLean);
    }
    async getManyPopulate(filter = {}, populate = { path: '', select: '' }, select = '', useLean = true) {
        return await this.model.find(filter).populate(populate.path, populate.select).select(select).lean(useLean);
    }
    async updateOneById(id, payload) {
        return await this.model.findByIdAndUpdate(id, payload, { new: true }).lean();
    }
    async updateOne(filter, payload) {
        return await this.model.updateOne(filter, payload, { new: true }).lean();
    }
    async updateMany(filter, payload) {
        await this.model.updateMany(filter, payload); // updateMany don't return the updated documents
        return await this.model.find(filter).lean();
    }
    async deleteOneById(id) {
        return await this.model.findByIdAndDelete(id).lean();
    }
    async deleteOne(filter) {
        return await this.model.deleteOne(filter).lean();
    }
    async deleteMany(filter) {
        return await this.model.deleteMany(filter).lean();
    }
}
exports.default = BaseDAO;
