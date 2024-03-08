import { Schema, model } from 'mongoose';
// disable the warning of mongoose-unique-validator package , it's don't have types yet
// @ts-ignore
import mongooseI18n from 'mongoose-i18n-localize';

import env from '../../config/validateEnv';
import { ICategory } from '../../interfaces/category.interface';

// Define the Service schema
const categorySchema: Schema<ICategory> = new Schema({
  name: {
    type: String,
    i18n: true,
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

categorySchema.plugin(mongooseI18n, { locales: ['en', 'ar'], defaultLocale: env.defaultLocale });

// Create the Service model
const Category = model('Category', categorySchema);

export default Category;
