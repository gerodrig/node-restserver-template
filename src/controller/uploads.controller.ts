import fs from 'fs';
import { Response } from 'express';

import { deleteFile, uploadFile, getImagePath, getAssetPath, uploadCloudinary, deleteCloudinary } from '../helpers';

import { Product, User } from '../models';

export const showImage = async (req: any, res: Response) => {

    const { collection, id } = req.params;



    let model: any;

    switch (collection) {
        case 'products':
            model = await Product.findById(id).select('image');
            break;
        case 'users':
            model = await User.findById(id).select('image');

            break;
        default:
            return res.status(400).json({
                message: 'Invalid collection',
            });
        }

    if (!model) {
        return res.status(404).json({
            message: 'Image not found',
        });
    }

    if(model.image){
        const imagePath = getImagePath(model.image, collection);
        if(fs.existsSync(imagePath)){
            return res.sendFile(imagePath);
        }
    }

    res.sendFile(getAssetPath('no_image.jpg'));
}

export const loadFile = async (req: any, res: Response) => { 

    try {
        const fileName = await uploadFile(req.files, ['txt', 'md'],  );
        
        return res.json({
            fileName,
        });
        
    } catch (error) {
        return res.status(400).json({
            message: error
        });
    }
   
}

export const updateImage = async (req: any, res: Response) => {

    const { collection, id } = req.params;

    let model: any;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if(!model){
                return res.status(400).json({
                    message: 'User not found with id ' + id
                });
            }
        break;
        case 'products':
            model = await Product.findById(id);

            if(!model){
                return res.status(400).json({
                    message: 'Product not found with id ' + id
                });
            }
            break;
        default:
            return res.status(500).json({ message: 'This is not a valid collection' });
    }

    //clean old image from server
    deleteFile(model.image, collection);

    //upload image file

    try {
        const name = await uploadFile(req.files, undefined, collection );
        model.image = name;
    
        //save to db
        await model.save();
    
        return res.json({
           model
        });
    } catch (error) {
        return res.status(400).json({
            message: error
        });
    }      
   
}

export const updateImageCloudinary = async (req: any, res: Response) => { 

    const { collection, id } = req.params;

    const { tempFilePath } = req.files.file

    let model: any;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if(!model){
                return res.status(400).json({
                    message: 'User not found with id ' + id
                });
            }
        break;
        case 'products':
            model = await Product.findById(id);

            if(!model){
                return res.status(400).json({
                    message: 'Product not found with id ' + id
                });
            }
            break;
        default:
            return res.status(500).json({ message: 'This is not a valid collection' });
    }

    //clean old image from server
    //deleteFile(model.image, collection);

    //upload image file

    // try {
    //     const name = await uploadFile(req.files, undefined, collection );
    //     model.image = name;
    
    //     //save to db
    //     await model.save();
    
    //     return res.json({
    //        model
    //     });
    // } catch (error) {
    //     return res.status(400).json({
    //         message: error
    //     });
    // }      

    //upload image file in cloudinary
    try {
        //clean old image from cloudinary
        await deleteCloudinary(model.image);

        const {secure_url} = await uploadCloudinary(tempFilePath);

        if(secure_url){
            model.image = secure_url;
            await model.save();
            return res.json({
                model
            });
        }

    } catch (error) {
        return res.status(400).json({
            message: error
        });
    }  
    
    res.json({
        message: 'Image NOT uploaded'
    });
}