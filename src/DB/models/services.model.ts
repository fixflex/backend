import { Document, Schema, model } from 'mongoose';

import { IService } from '../../interfaces/services.interface';

// Define the Service schema
const serviceSchema: Schema<IService & Document> = new Schema({
  name: {
    type: String,
    required: true,
  },
});

// Create the Service model
const Service = model('Service', serviceSchema);

export default Service;
