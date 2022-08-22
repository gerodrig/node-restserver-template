import { Request, Response } from 'express';
import { Category } from '../models';

//GET Categories -public must be paginated and total count and populate "user" by id
export const getCategories = async (req: Request, res: Response) => {

    const { limit = 10, skip = 0 } = req.query;

    const categories = await Category.find({ status: true })
        .skip(Number(skip))
        .limit(Number(limit))
        .populate('user', 'id')
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
                                    .populate('user', 'id');

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

    const name = req.body.name.toUpperCase() as string;

    const dbCategory = await Category.findOne({ name });

    if(dbCategory){
        return res.status(400).json({
            message: `Category ${dbCategory.name} already exists`
        });
    }

    //Generate data to save
    const data = {
        name,
        user: req.user._id
    }

    const category = new Category(data);

    //Save to db
    await category.save();

    return res.status(201).json({
        message: 'Category created successfully',
        category
    });
}

//UPDATE category - private - any person with a valid token
export const updateCategory = async (req: any, res: Response) => {

    const { id } = req.params;
    const { state, user, ...data } = req.body;

    data.name = data.name.toUpperCase() as string;
    data.user = req.user._id;
    
    //search for category and update
    const category = await Category.findByIdAndUpdate(id, data, { new: true });

    if(!category){
        return res.status(404).json({
            message: `Category ${category} not found`,
        });
    }

    res.json({
        message: 'Category updated successfully',
        category
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