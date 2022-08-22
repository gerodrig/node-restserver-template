import {Schema, model} from 'mongoose';
import { IProduct } from '../interfaces';


const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is required'],
        unique: true,
    },
    state: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        default: 0,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String,
    },
    available: {
        type: Boolean,
        default: true,
    }
});

ProductSchema.methods.toJSON = function () {
    const {__v, state, ...object} = this.toObject();
    return object;
}


export const Product = model<IProduct>('Product', ProductSchema);