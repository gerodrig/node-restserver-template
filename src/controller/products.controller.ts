import {Request, Response } from 'express';
import { Product } from '../models';


//GET Products -public must be paginated and total count and populate "user" by id
export const getProducts = async (req: any, res: Response) => {

    const { limit = 10, skip = 0 } = req.query;

    const products = await Product.find({ state: true })
                                    .skip(Number(skip))
                                    .limit(Number(limit))
                                    .populate('user', 'id')
                                    .populate('category', 'id')
                                    .sort({ name: 1 });

    res.json({
        total: products.length,
        products,
    });
}

export const getProduct = async (req: any, res: Response) => {
    const { id } = req.params;
    
    const product = await Product.findById(id)
                                    .populate('user', 'id');

    if(!product){
        return res.status(404).json({
            message: `Product ${product} not found`,
        });
    }

    res.json({
        product,
    })
}

export const createProduct = async (req: any, res: Response) => {

    const {name, price = 0, description, category} = req.body;

    //check if product already exists   
    //find by name regex ignoring case
    const dbProduct = await Product.findOne({name: {$regex: new RegExp(name, 'i')}});

    if(dbProduct){
        return res.status(400).json({
            message: `Category ${dbProduct.name} already exists`
        });
    }

    //generate data to save
    const data = {
        name: name.toUpperCase(),
        category,
        price: Number(price),
        user: req.user._id,
        description
    }

    //save to db
    const product = new Product(data);
    await product.save();

    return res.status(201).json({
        message: 'Product created successfully',
        product
    });
}

export const updateProduct = async (req: any, res: Response) => {
    const { id } = req.params;
    const { state, user, ...data } = req.body;


    //update data
    data.name = data.name.toUpperCase() as string;
    data.user = req.user._id;
    data.price = Number(data.price) ?? 0;
    
    //search for category and update
    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    if(!product){
        return res.status(404).json({
            message: `Product ${product} not found`,
        });
    }

    res.json({
        message: 'Product updated successfully',
        product
    });
}

export const deleteProduct = async (req: any, res: Response) => {
    const { id } = req.params;

    //find product by id and update the status to false
    const product = await Product.findByIdAndUpdate(id, { state: false }, { new: true });

    if(!product){
        return res.status(404).json({
            message: `Product ${product} not found`,
        });
    }

    res.json({
        message: 'Product deleted successfully',
        product
    });
}