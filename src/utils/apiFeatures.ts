import { IPagination } from '../interfaces/respons.interface';

class APIFeatures {
  constructor(private reqQuery: any) {}

  filter() {
    // 1- Filteration
    let query = { ...this.reqQuery };
    let excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
    excludedFields.forEach(field => delete query[field]);

    // 2- Advanced Filteration (gt, gte, lt, lte, in) (mongodb operators)
    let queryStr = JSON.stringify(query);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    query = JSON.parse(queryStr);
    return query;
  }

  paginate(countDocuments: number = 0) {
    // 2- Pagination
    let page = parseInt(this.reqQuery.page) || 1;
    let limit = parseInt(this.reqQuery.limit) || 10;
    let skip = (page - 1) * limit;

    // Pagination result
    let pagination: IPagination = {
      currentPage: page,
      limit,
      skip,
    };

    if (countDocuments === 0) return pagination;

    pagination.totalPages = Math.ceil(countDocuments / limit); // round up to the nearest integer
    pagination.totalDocuments = countDocuments;
    pagination.hasNextPage = page < pagination.totalPages;
    pagination.hasPrevPage = page > 1;
    pagination.nextPage = page + 1;
    pagination.prevPage = page - 1;

    return pagination;
  }
  sort() {
    // 3- Sorting
    let sort = this.reqQuery.sort?.split(',').join(' ') || '-createdAt'; // default sort by createdAt desc
    return sort;
  }

  selectFields() {
    // 4- Fields limiting (projecting & selecting)
    let fields = this.reqQuery.fields?.split(',').join(' ') || '-__v'; // default exclude __v field

    return fields;
  }
}

export default APIFeatures;
