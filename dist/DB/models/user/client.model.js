import { Schema, model } from 'mongoose';
let clientSchema = new Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });
let Client = model('Client', clientSchema);
export default Client;
