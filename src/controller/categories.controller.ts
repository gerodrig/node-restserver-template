import { Request, Response } from 'express';
import { Category } from '../models';

//GET Categories -public must be paginated and total count and populate "user" by id
export const getCategories = async (req: Request, res: Response) => {

    const { limit = 10, skip = 0 } = req.query;

    const categories = await Category.find({ status: true })
        .skip(Number(skip))
        .limit(Number(limit))
        .populate('user', 'name')
        .sort({ name: 1 });

    res.json({
        total: categories.length,
        categories,
    });
}

//GET one category by id - public
export const getCategory = async (req: Request, res: Response) => {
    
    const { id } = req.params;
    
    const category = await Category.findById(id)
                                    .populate('user', 'name');

    if(!category){
        return res.status(404).json({
            message: `Category ${category} not found`,
        });
    }


    res.json({
        category,
    })
}

export const createCategory = async (req: any, res: Response) => {

    // const name = req.body.name.toUpperCase() as string;
    const { name } = req.body;

    const dbCategory = await Category.findOne({ name });

    if(dbCategory){
        return res.status(400).json({
            message: `Category ${name} already exists`
        });
    }

    if(!req.user){
        return res.status(500).json({
            message: 'User is required to create Category'
        });
    }

    //Generate data to save
    const data = {
        name,
        user: {
            _id: req.user.uid,
            name: req.user.name
        }
    }

    const category = new Category(data);

    //Save to db
    await category.save();

    await category.populate('user', 'name');

    console.log(category);

    res.json({
        message: 'Category updated successfully',
        category
    });
}

//UPDATE category - private - any person with a valid token
export const updateCategory = async (req: any, res: Response) => {

    //check if user is not active
    if(!req.user.isActive){
        return res.status(401).json({
            message: 'User is not active'
        });
    }

    const { id } = req.params;
    const { ...data } = req.body;

    data.user = req.user.uid;
    
    //search for category and update
    const category = await Category.findByIdAndUpdate(id, data, { new: true });

    if(!category){
        return res.status(404).json({
            message: `Category ${category} not found`,
        });
    }

    res.json({
        message: 'Category updated successfully',
        category: {
            _id: category._id,
            name: category.name,
            user: {
                _id: req.user.uid,
                name: req.user.name
            }
        }
    });

}

//DELETE category - private - admins with a valid token. Set status active to false
export const deleteCategory = async (req: any, res: Response) => {

    const { id } = req.params;

    //find category and update status
    const category = await Category.findByIdAndUpdate(id, { status: false }, { new: true });

    if(!category){
        return res.status(404).json({
            message: `Category ${category} not found`,
        });
    }

    res.json({
        message: 'Category deleted successfully',
        category
    });

}