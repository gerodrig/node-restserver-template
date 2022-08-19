import { Response, Request } from 'express';
import bcryptjs from 'bcryptjs';

import { User } from '../models';
import { IUser } from '../interfaces';
import { encryptPassword } from '../helpers';

export const usersGet = async (req: Request, res: Response) => {


    //extract params
    //const { q, name , apikey, page = 1, limit = 10 } = req.query;

    //get all users
    const { limit = 10, skip = 0 } = req.query;
    //sort descending by name
    const users = await User.find({isActive: true})
                            .skip(Number(skip))
                            .limit(Number(limit))
                            .sort({ name: 1 });

    //doing the same request with a promise
    // const query = {isActive: true};
    // const [total, users] = await Promise.all([
    //     User.countDocuments( query),
    //     User.find(query)
    //         .skip(Number(skip))
    //         .limit(Number(limit))
    //         .sort({ name: 1 })
    // ]);

    res.json({
        message: 'Rest API with typescript GET',
        total: users.length,
        users
    });
}

export const usersPut = async (req: Request, res: Response) => {

    const { id } = req.params;
    const { _id, password, google, email, ...rest } = req.body;

    //TODO: validate in Database
    if(password){
        rest.password = encryptPassword(password);
    }

    const user = await User.findByIdAndUpdate(id, rest).select('-google -_id -image');

    res.json({
        message: 'Rest API with typescript PUT',
        user
    });
}

export const usersPost = async (req: Request, res: Response) => {

    const {name, email, password, role} = req.body as IUser;
    const user = new User({name , email, password, role});

    //Ecrypt password
    user.password = encryptPassword(password);
  
    
    //save in DB
    await user.save();

    res.json({
        user
    });
}

export const usersDelete = async (req: Request, res: Response) => {
    const { id } = req.params;

    //! delete user from DB This is not recommended as we need to set user.isActive to false
    //* const user = await User.findByIdAndDelete(id);
    const user = await User.findByIdAndUpdate(id, {isActive: false});

    res.json({
        message: 'Rest API with typescript DELETE',
        user
    });
}

