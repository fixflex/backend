// import { IPagination } from '../interfaces/pagination.interface';
import { FilterQuery, Query } from 'mongoose';

import { IPagination } from '../interfaces';

class APIFeatures {
  constructor(private reqQuery: any) {}

  filter() {
    // 1- Filteration
    let query = { ...this.reqQuery };
    let excludedFields = ['page', 'sort', 'limit', 'fields'];
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
    pagination.next = page + 1;
    pagination.prev = page - 1;

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

export { APIFeatures };

// ########################################  //
// ########################################  //
// ########################################  //

// import TaskModel from 'path-to-your-task-model';

// class TaskQueryBuilder {
//   constructor() {
//     this.queryString = {};
//     this.mongooseQuery = TaskModel.find();
//   }

//   filter(query) {
//     const queryStringObj = { ...query };
//     const excludesFields = ["limit", "page", "select", "sort", "exclude"];
//     excludesFields.forEach((field) => {
//       delete queryStringObj[field];
//     });
//     let querStr = JSON.stringify(queryStringObj);
//     querStr = querStr.replace(
//       /\b(gte|gt|lte|lt)\b/g,
//       (match) => `$${match}`
//     );
//     this.mongooseQuery = this.mongooseQuery.find(JSON.parse(querStr));
//     return this;
//   }

//   sort(sortBy) {
//     if (sortBy) {
//       this.mongooseQuery = this.mongooseQuery.sort(sortBy);
//     } else {
//       this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
//     }
//     return this;
//   }

//   limitFields(fields, excludeFields) {
//     if (fields) {
//       const selectedFields = fields.split(',').join(' ');
//       this.mongooseQuery = this.mongooseQuery.select(selectedFields);
//     } else if (excludeFields) {
//       const excludedFields = excludeFields.split(',').reduce((acc, field) => {
//         acc[field] = 0; // Exclude the specified field
//         return acc;
//       }, {});
//       this.mongooseQuery = this.mongooseQuery.select(excludedFields);
//     } else {
//       this.mongooseQuery = this.mongooseQuery.select("-__v");
//     }
//     return this;
//   }

//   search(keyword, modelName) {
//     if (keyword) {
//       let query = {};
//       if (modelName === "Products") {
//         query.$or = [
//           {
//             title: {
//               $regex: keyword,
//               $options: "i",
//             },
//           },
//           {
//             description: { $regex: keyword, $options: "i" },
//           },
//         ];
//       } else {
//         query = {
//           name: {
//             $regex: keyword,
//             $options: "i",
//           },
//         };
//       }

//       this.mongooseQuery = this.mongooseQuery.find(query);
//     }
//     return this;
//   }

// locationFilter(query) {
//   if (query.location === 'online') {
//     // Implement online location logic
//   } else {
//     const loca = query.location.split(',');
//     const longitude = parseFloat(loca[0]);
//     const latitude = parseFloat(loca[1]);
//     const maxDistance = parseFloat(query.maxDistance || "60"); // Default to 60 km if maxDistance is not provided

//     this.mongooseQuery = this.mongooseQuery.find({
//       location: {
//         $near: {
//           $maxDistance: maxDistance * 1000, // Convert km to meters (MongoDB uses meters)
//           $geometry: {
//             type: 'Point',
//             coordinates: [longitude, latitude], // [longitude, latitude] [x, y]
//           },
//         },
//       },
//     });
//   }
//   return this;
// }

//   paginate(page, limit) {
//     const skip = (page - 1) * limit;
//     this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
//     return this;
//   }

//   build() {
//     return this.mongooseQuery;
//   }
// }

// // async function getTasks(query) {
// //   const taskQueryBuilder = new TaskQueryBuilder();

// //   taskQueryBuilder
// //     .filter(query)
// //     .sort(query.sort)
// //     .limitFields(query.select, query.exclude)
// //     .search(query.keyword, 'Products') // Assuming 'Products' as the default modelName
// //     .locationFilter(query)
// //     .paginate(query.page || 1, query.limit || 50);

// //   const tasks = await taskQueryBuilder.build().exec();

// //   return tasks;
// // }

// ########################################  //
// ########################################  //
// ########################################  //

export class QueryBuilder<T> {
  pagination: IPagination | undefined;
  constructor(public mongooseQuery: Query<T[], T>, public queryString: any) {}

  filter(extraExcludesFields: string[] = []) {
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
    // if (this.queryString.online === 'true' && this.queryString.location) {
    //   // return all tasks online or near by
    //   const location = this.queryString.location.split(',');
    //   const longitude = parseFloat(location[0]);
    //   const latitude = parseFloat(location[1]);
    //   const maxDistance = parseFloat(this.queryString.maxDistance || '60'); // Default to 60 km if maxDistance is not provided

    //   this.mongooseQuery = this.mongooseQuery.find({
    //     location: {
    //       $near: {
    //         $maxDistance: maxDistance * 1000, // Convert km to meters (MongoDB uses meters)
    //         $geometry: {
    //           type: 'Point',
    //           coordinates: [longitude, latitude], // [longitude, latitude] [x, y]
    //         },
    //       },
    //     },
    //   });
    // }
    if (this.queryString.online === 'true') {
      // return all tasks where location is online
      this.mongooseQuery = this.mongooseQuery.find({ 'location.online': true });
    } else if (this.queryString.location) {
      // return all tasks near by
      const location = this.queryString.location.split(',');
      const latitude = parseFloat(location[0]);
      const longitude = parseFloat(location[1]);
      const maxDistance = parseFloat(this.queryString.maxDistance || '60'); // Default to 60 km if maxDistance is not provided

      console.log(longitude, latitude, maxDistance);
      this.mongooseQuery = this.mongooseQuery.find({
        location: {
          $near: {
            $maxDistance: maxDistance * 1000, // Convert km to meters (MongoDB uses meters)
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude], // [longitude, latitude] [x, y]
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
  search(modelFields: string[]) {
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
      this.mongooseQuery = this.mongooseQuery.find(query as FilterQuery<T>);
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select('-__v');
    }
    return this;
  }

  paginate(countDocuments: number) {
    const page: number = 1 * this.queryString.page || 1;
    const limit: number = 1 * this.queryString.limit || 50;
    const skip: number = (page - 1) * limit;
    const endIndex: number = page * limit;

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

// Usage
// const mongooseQuery = YourModel.find();
// const queryString = { keyword: "your_keyword", sort: "createdAt", fields: "field1,field2", page: 1, limit: 10 };
// const queryBuilder = new QueryBuilder(mongooseQuery, queryString);

// // Example for 'search'
// const modelFieldsForSearch = { field1: true, field2: true }; // Specify fields that can be searched
// queryBuilder.search(modelFieldsForSearch);

// // Example for 'filter'
// const queryFieldsForFilter = ["field1", "field2"]; // Specify fields that can be used for filtering
// queryBuilder.filter(queryFieldsForFilter);

// Continue with other methods as needed
// queryBuilder.sort().limitFields().paginate(countDocuments);

// const query = queryBuilder.build();
// const results = await query.exec();
