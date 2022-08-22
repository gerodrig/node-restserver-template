
import { Router } from 'express';
import { check } from 'express-validator';

import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controller/products.controller';
import { productExists } from '../helpers';
import { isAdminRole, validateFields, validateJWT, isValidCategory } from '../middlewares';

const router = Router();

// GET all products this service will be public
router.get('/', getProducts);

// GET products by id this service will be public
router.get('/:id',[
    check('id', 'ID is not valid').isMongoId(),
    check('id').custom( productExists ), 
    validateFields
], getProduct);

// POST create new product - private - any person with a valid token
router.post('/',[
    validateJWT,
    isValidCategory,
    check('name', 'Name is required').not().isEmpty(),
    check('price', 'Price must be a number').optional().isNumeric(),
    validateFields,
],createProduct);

//PUT update category - private - any person with a valid token
router.put('/:id',[
    validateJWT,
    isValidCategory,
    check('id', 'ID is not valid').isMongoId(),
    check('id').custom( productExists ), 
    check('name', 'Name is required').not().isEmpty(),
    check('price', 'Price must be a number').isNumeric(),
    validateFields
], updateProduct);

router.delete('/:id',[
validateJWT,
isAdminRole,
check('id', 'ID is not valid').isMongoId(),
check('id').custom( productExists ),
validateFields
],deleteProduct);




export default router;