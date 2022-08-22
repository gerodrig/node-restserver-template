import { Schema, model } from 'mongoose';
import { ICategory } from '../interfaces';

const CategorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true
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
});

//overwrite toJSON method to hide __v and state fields
CategorySchema.methods.toJSON = function () {
    const { __v, state, ...obj}= this.toObject();

    return obj;
}

export const Category = model<ICategory>('Category', CategorySchema);


