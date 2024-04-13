import { Schema, model } from 'mongoose';
import mongooseI18n from 'mongoose-i18n-localize';

import env from '../../config/validateEnv';
import { ICategory } from '../../interfaces/category.interface';

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

const Category = model('Category', categorySchema);

export default Category;
