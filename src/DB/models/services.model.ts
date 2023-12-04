import { Schema, model } from 'mongoose';

import { IService } from '../../interfaces/services.interface';

// Define the Service schema
const serviceSchema: Schema<IService> = new Schema({
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
const Service = model('Service', serviceSchema);

export default Service;
