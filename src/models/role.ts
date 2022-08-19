import {Schema, model} from 'mongoose';
import {IRole} from '../interfaces';

const RoleSchema = new Schema({
    role: {
        type: String,
        required: [true, 'Role is required']
    }
});


export const Role = model<IRole>('Role', RoleSchema);