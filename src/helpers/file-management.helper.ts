import fs from 'fs';
import path from 'path';
import { NextFunction, Response } from 'express';

import { v2 as cloudinary } from 'cloudinary'
import { v4 as uuidv4 } from 'uuid';

//configure cloudinary
cloudinary.config(process.env.CLOUDINARY_URL as string);

export const uploadCloudinary = async ( tempPath: string ): Promise<any> =>{

 return cloudinary.uploader.upload(tempPath);
}

export const deleteCloudinary = async ( fileName: string ): Promise<any> =>{
  const name = fileName.split('/').at(-1);
  const public_id = name?.split('.')[0];
  
  return cloudinary.uploader.destroy(public_id as string);
}


export const uploadFile = (
  files: any,
  validExtensions: string[] = ['jpg', 'jpeg', 'png', 'gif'],
  directory: string = ''
): Promise<string> => {
  return new Promise((resolve, reject) => {
      //check if no files in the request
    if (!files || Object.keys(files).length === 0 || !files.file) {
        return reject('No files were uploaded.');
    }

    const { file } = files;

    //console.log(typeof file);

    //validate the file name
    const fileName = file.name.split('.');
    const fileExtension = fileName[fileName.length - 1];

    if (!validExtensions.includes(fileExtension)) {
      return reject(
        `The file extension ${fileExtension} is not valid. Valid extensions are ${validExtensions.join(
          ', '
        )}`
      );
    }
    //create the temp file name
    const tempFileName = `${uuidv4()}.${fileExtension}`;

    const uploadPath = path.join(
      __dirname,
      '../uploads',
      directory,
      tempFileName
    );

    file.mv(uploadPath, async (err: string) => {
      if (err) {
        return reject(err);
      }
    });

    return resolve(tempFileName);
  });
};

export const validateUploadedFile = async (req: any, res: Response, next: NextFunction) => {
    
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({
            message: 'No files were uploaded.'
        });
    }

    next();
}

export const deleteFile = (fileName: string, directory: string = ''): void | string => {
    if(fileName){
        const oldImagePath = getImagePath(fileName, directory);
        // const oldImagePath = `./uploads/${collection}/${oldImage}`;
        // const oldImagePathRoot = path.join(__dirname, `../uploads/${oldImage}`);

        if(fs.existsSync(oldImagePath)){
            fs.unlinkSync(oldImagePath);
    
        }
        // if(fs.existsSync(oldImagePathRoot)){
        //     fs.unlinkSync(oldImagePathRoot);
        // }
    }
}
    
    export const getImagePath = (fileName: string, directory: string = ''): string => {
        return path.join(__dirname, '../uploads/', directory, fileName);
    }
    
    export const getAssetPath = (fileName: string, directory: string = ''): string => {
      return path.join(__dirname, '../assets/', directory, fileName);
    }
