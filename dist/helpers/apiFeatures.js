"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
class QueryBuilder {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }
    filter(extraExcludesFields = []) {
        const queryStringObj = { ...this.queryString };
        const defaultExcludesFields = ['limit', 'page', 'fields', 'sort', 'keyword'];
        const excludesFields = [...defaultExcludesFields, ...extraExcludesFields];
        excludesFields.forEach(field => {
            delete queryStringObj[field];
        });
        let querStr = JSON.stringify(queryStringObj);
        querStr = querStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(querStr));
        return this;
    }
    locationFilter() {
        if (this.queryString.online === 'true') {
            // return all tasks where location is online
            this.mongooseQuery = this.mongooseQuery.find({ 'location.online': true });
        }
        else if (this.queryString.location) {
            // return all tasks near by
            const location = this.queryString.location.split(',');
            const longitude = parseFloat(location[0]);
            const latitude = parseFloat(location[1]);
            const maxDistance = parseFloat(this.queryString.maxDistance || '60'); // Default to 60 km if maxDistance is not provided
            this.mongooseQuery = this.mongooseQuery.find({
                location: {
                    $near: {
                        $maxDistance: maxDistance * 1000,
                        $geometry: {
                            type: 'Point',
                            coordinates: [longitude, latitude], // [longitude, latitude]
                        },
                    },
                },
            });
            // .sort({ 'location.coordinates': 'asc' });
        }
        return this;
    }
    /**
     * Adds a search filter to the Mongoose query based on the provided keyword and model fields.
     * @param modelFields - The model fields to search within.
     */
    search(modelFields) {
        // Check if a keyword is provided in the query string
        if (this.queryString.keyword) {
            // Construct a Mongoose query for a case-insensitive search on each specified model field
            const query = {
                $or: modelFields.map(field => ({
                    [field]: {
                        $regex: this.queryString.keyword,
                        $options: 'i', // Case-insensitive
                    },
                })),
            };
            // Apply the search query to the Mongoose query
            this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
    }
    sort(defaultSort = '-createdAt') {
        if (this.queryString.sort) {
            // concatinate the default sort with the query sort
            const sortBy = this.queryString.sort;
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        }
        else {
            this.mongooseQuery = this.mongooseQuery.sort(defaultSort);
        }
        return this;
    }
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        }
        else {
            this.mongooseQuery = this.mongooseQuery.select('-__v');
        }
        return this;
    }
    paginate(countDocuments) {
        const page = 1 * this.queryString.page || 1;
        const limit = 1 * this.queryString.limit || 20;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;
        this.pagination = {
            currentPage: page,
            limit,
            skip,
            totalPages: Math.ceil(countDocuments / limit),
            totalDocuments: countDocuments,
        };
        // Next page
        if (endIndex < countDocuments) {
            this.pagination.next = page + 1;
        }
        // Previous page
        if (skip) {
            this.pagination.prev = page - 1;
        }
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        return this;
    }
}
exports.QueryBuilder = QueryBuilder;
