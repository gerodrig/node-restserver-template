import { Response, Request } from 'express';

import { User } from '../models';
import { IUser } from '../interfaces';
import { encryptPassword } from '../helpers';
import { generateJWT } from '../helpers/generate-jwt.helper';

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

export const userGet = async (req: Request, res: Response) => {
    
        const { id } = req.params;
    
        const user = await User.findById(id).select('-google -_id -password -__v');

        if(!user){
            return res.status(404).json({
                message: 'User not found'
            });
        }

        //add uid to user
        const userObj = user.toObject();

        userObj.uid = id;
    
        res.json({
            message: 'User found',
            user: userObj
        });
}

export const usersPut = async (req: Request, res: Response) => {

    const { id } = req.params;
    const { _id, password, google, ...rest } = req.body;

    // validate in Database
    if(password){
        rest.password = encryptPassword(password);
    }

    const user = await User.findByIdAndUpdate(id, rest).select('-google -_id -password');

    //populate user with role and image
    user?.populate('role', 'name');

    user!.email = rest.email?.toLowerCase() || user!.email;

    res.json({
        message: 'Rest API with typescript PUT',
        user
    });
}

export const usersPost = async (req: Request, res: Response) => {

    console.log(req.body);

    const {name, email , password, role = 'user'} = req.body as IUser;
    console.log({role});
    const user = new User({name , email, password, role});

    //Ecrypt password
    user.password = encryptPassword(password);

    //User Email to lowercase
    user.email = email.toLowerCase();
      
    //save in DB
    await user.save();

    //Generate JWT
    const token = await generateJWT(user.id);

    res.json({
        user,
        token
    });
}

export const usersDelete = async (req: any, res: Response) => {
    const { id } = req.params;

    //! delete user from DB This is not recommended as we need to set user.isActive to false
    //* const user = await User.findByIdAndDelete(id);
    const user = await User.findByIdAndUpdate(id, {isActive: false});

    // TODO: get authenticated user

    res.json({
        user
    });
}

