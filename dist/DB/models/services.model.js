import { Schema, model } from 'mongoose';
// Define the Service schema
const serviceSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
});
// Create the Service model
const Service = model('Service', serviceSchema);
export default Service;
