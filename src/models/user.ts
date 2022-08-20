import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces';

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    image: {
        type: String,
        default: 'user-default.jpeg'
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: ['user', 'admin', 'guest', 'super-admin'],
    },
    isActive: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});


//override the toJSON method to remove the password and __V from the response
UserSchema.methods.toJSON = function() {
    const {__v, password, _id, ...user} = this.toObject();
    user.uid = _id;
    return user;
}

export const User = model<IUser>('User', UserSchema);