import { Router } from 'express';
import { check } from 'express-validator';
import { loadFile, updateImageCloudinary, showImage } from '../controller/uploads.controller';
import { allowedCollections } from '../helpers';
import { validateFields } from '../middlewares';
import { validateUploadedFile } from '../helpers/';


const router = Router();

router.post('/', validateUploadedFile, loadFile);

router.put('/:collection/:id',[
    validateUploadedFile,
    check('id', 'ID must be a valid Mongo ObjectId').isMongoId(),
    check('collection').custom( collection => allowedCollections( collection, ['users', 'products'])),
    validateFields
], updateImageCloudinary);
// ], updateImage);

router.get('/:collection/:id/',[
    check('id', 'ID must be a valid Mongo ObjectId').isMongoId(),
    check('collection').custom( collection => allowedCollections( collection, ['users', 'products'])),
    validateFields
], showImage);



export default router;