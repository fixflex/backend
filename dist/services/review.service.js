"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewServiec = void 0;
const tsyringe_1 = require("tsyringe");
const dao_1 = require("../DB/dao");
const review_dao_1 = require("../DB/dao/review.dao");
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const interfaces_1 = require("../interfaces");
let ReviewServiec = class ReviewServiec {
    constructor(reviewDao, taskDao) {
        this.reviewDao = reviewDao;
        this.taskDao = taskDao;
    }
    async createReview(review, userId) {
        // Step 1: check if the user is the task owner
        const task = await this.taskDao.getOneById(review.taskId);
        if (!task)
            throw new Error('task_not_found');
        if (task.userId !== userId)
            throw new HttpException_1.default(403, 'unauthorized');
        // Step 2: check if the task is completed
        if (task.status !== interfaces_1.TaskStatus.COMPLETED)
            throw new HttpException_1.default(400, 'task_not_completed');
        // Step 3: check if the user has already reviewed the task
        // const reviewed = await this.reviewDao.getOne({ taskId: review.taskId, userId });
        // if (reviewed) throw new HttpException(400, 'already_reviewed');
        // Step 4: create the review and return it
        review.userId = userId;
        review.taskerId = task.taskerId;
        return await this.reviewDao.create(review);
    }
    async getReviews(query) {
        const { reviews, pagination } = await this.reviewDao.getReviews(query);
        return { reviews, pagination };
    }
    async getReviewById(reviewId) {
        return await this.reviewDao.getOneById(reviewId);
    }
    async updateReview(reviewId, review, userId) {
        // 1) check if the review exists and the user is the owner then update it
        const updatedReview = await this.reviewDao.updateOne({ _id: reviewId, userId }, review);
        if (!review)
            throw new HttpException_1.default(400, 'something_went_wrong');
        return updatedReview;
    }
    async deleteReview(reviewId, userId) {
        // 1) check if the review exists and the user is the owner then delete it
        const deletedReview = await this.reviewDao.deleteOne({ _id: reviewId, userId }); // this will delete the review where the id and the user id are matched
        if (!deletedReview)
            throw new HttpException_1.default(400, 'something_went_wrong');
        return deletedReview;
    }
};
exports.ReviewServiec = ReviewServiec;
exports.ReviewServiec = ReviewServiec = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [review_dao_1.ReviewDao, dao_1.TaskDao])
], ReviewServiec);
