import { Router } from 'express';
import { check } from 'express-validator';

import { validateFields, validateJWT, isAdminRole } from '../middlewares';
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from '../controller/categories.controller';
import { categoryExists } from '../helpers';

const router = Router();
/**
 * {{url}}/api/categories
 */

// GET all categories this service will be public
router.get('/', getCategories);

// GET one category by id - public
router.get('/:id',[
    check('id', 'ID is not valid').isMongoId(),
    check('id').custom( categoryExists ), 
    validateFields
], getCategory);

// POST create new category - private - any person with a valid token
router.post('/', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    validateFields
], createCategory );

//PUT update category - private - any person with a valid token
router.put('/:id',[
    validateJWT,
    check('id', 'ID is not valid').isMongoId(),
    check('id').custom( categoryExists ), 
    check('name', 'Name is required').not().isEmpty(),
    validateFields
], updateCategory);

// DELETE delete category - private - admins with a valid token. Set status active to false
router.delete('/:id',[
    validateJWT,
    isAdminRole,
    check('id', 'ID is not valid').isMongoId(),
    check('id').custom( categoryExists ),
    validateFields
],deleteCategory);

export default router;
