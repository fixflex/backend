import { Schema, model } from 'mongoose';

import { ICategory } from '../../interfaces/category.interface';

// Define the Service schema
const categorySchema: Schema<ICategory> = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    publicId: {
      type: String,
      default: null,
    },
  },
});

// Create the Service model
const Service = model('Category', categorySchema);

export default Service;
