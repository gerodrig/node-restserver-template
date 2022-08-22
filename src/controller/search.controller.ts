import { Response } from 'express';
import { Types } from 'mongoose';
import { User, Category, Product, Role } from '../models';
//define allowed collections this can be fetched from the database
const allowedCollections = ['users', 'roles', 'products', 'categories'];

const searchUsers = async (term = '', res: Response) => {

        const isMongoId = Types.ObjectId.isValid(term); //TRUE

        if(isMongoId){
            const user = await User.findById(term);
           return res.json({
                results: (user) ? [user] : [],
            });
        }

        const regex = new RegExp(term, 'i');
        //search by name ignoring case
        const users = await User.find({
            $or: [{ name: regex }, { email: regex }],
            $and: [{ isActive: true }],
        });

        return res.json({
            results: users || [],
        });

}

const searchRoles = async (term = '', res: Response) => {

    const isMongoId = Types.ObjectId.isValid(term); //TRUE

    if(isMongoId){
        const role = await Role.findById(term);
         return res.json({
            results: (role) ? [role] : [],
        });
    }

    const regex = new RegExp(term, 'i');

    const roles = await Role.find({ role: regex });

    return res.json({
        results: roles || [],
    });
}

const searchProducts = async (term = '', res: Response) => {

    const isMongoId = Types.ObjectId.isValid(term); //TRUE

    if(isMongoId){
        const product = await Product.findById(term).populate('category', 'name');
        return res.json({
            results: (product) ? [product] : [],
        });
    }

    const regex = new RegExp(term, 'i');

    const products = await Product.find({ name: regex, state: true }).populate('category', 'name');

    return res.json({
        results: products || [],
    });
}

const searchCategories = async (term = '', res: Response) => {

    const isMongoId = Types.ObjectId.isValid(term); //TRUE

    if(isMongoId){
        const category = await Category.findById(term);
        return res.json({
            results: (category) ? [category] : [],
        });
    }

    const regex = new RegExp(term, 'i');

    const categories = await Category.find({ category: regex, state: true });

    return res.json({
        results: categories || [],
    });
}

export const search = async (req: any, res: Response) => {

    const { collection , term } = req.params;

    //check if collection is allowed
    if(!allowedCollections.includes(collection)){
        return res.status(400).json({
            message: `Collections allowed are ${allowedCollections.join(', ')}`
        });
    }
    //run a query on the collection usin a switch statement
    switch(collection){
        case 'users':
            searchUsers(term, res);
            break;
        case 'roles':
            searchRoles(term, res);
            break;
        case 'products':
            searchProducts(term, res);
            break;
        case 'categories':
            searchCategories(term, res);
            break;

        default:
            return res.status(400).json({
                message: 'Collection not found'
            });
    }

    // return res.json({
    //     message: 'Searching Working',
    //     collection,
    //     term
    // });
}