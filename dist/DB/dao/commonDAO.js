"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// common DAO
class CommonDAO {
    constructor(model) {
        this.model = model;
    }
    async create(entity) {
        return await this.model.create(entity);
    }
    async getOneById(id, useLean = true) {
        return await this.model.findById(id).select('-password -__v -role').lean(useLean);
    }
    async getMany(filter = {}, useLean = true) {
        return await this.model.find(filter).lean(useLean);
    }
    async updateOneById(id, payload) {
        return await this.model.findByIdAndUpdate(id, payload, { new: true }).select('-password -__v -role').lean();
    }
    async updateMany(filter, payload) {
        await this.model.updateMany(filter, payload); // updateMany don't return the updated documents
        return await this.model.find(filter).lean();
    }
    async deleteOneById(id) {
        return await this.model.findByIdAndDelete(id).lean();
    }
}
exports.default = CommonDAO;
