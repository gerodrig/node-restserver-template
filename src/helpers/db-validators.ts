import { Role, User } from "../models/";
import bcryptjs from 'bcryptjs';


export const isValidRole = async (role = '') => {
    const roleExists = await Role.findOne({role});
    
    if(!roleExists){
        throw new Error(`Role ${role} is not valid`);
    }
}

export const isValidEmail = async (email = '') => {
    const emailExists = await User.findOne({email});

    if(emailExists){
        throw new Error(`Email ${email} already exists`);
    }
}

export const userByIdExists = async (id = '') => {
    const user = await User.findById(id);

    if(!user){
        throw new Error(`User with ID ${id} not found`);
    }
}

export const encryptPassword = (password:string = '', saltGen: number = 10): string => {
    const salt = bcryptjs.genSaltSync(saltGen);
    return bcryptjs.hashSync(password, salt);
}

export const comparePassword = (password:string = '', encryptedPassword: string = ''): boolean => {
    return bcryptjs.compareSync(password, encryptedPassword);
}