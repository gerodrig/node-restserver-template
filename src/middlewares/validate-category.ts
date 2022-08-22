import { Types } from 'mongoose';
import { Response, NextFunction} from 'express';
import { Category } from '../models';

export const isValidCategory = async (req: any, res: Response, next: NextFunction) => {

    let data = req.body.category;

    if(!data){
        return res.status(400).json({
            message: 'Category is required'
        });
    }
    
    let category = {} as any;
    
    if(Types.ObjectId.isValid(data)){
        //findbyId and state not false
        category = await Category.findById(data);
    } else {
        category = await Category.findOne({name: data.toUpperCase()});
    }

    if(!category || !category?.state){
        return res.status(404).json({
            message: 'Invalid Category'
        });
    }

    req.body.category = category._id;

    next();
}


