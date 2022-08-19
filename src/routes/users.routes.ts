import { Router } from 'express';
import { check } from 'express-validator';
import { usersGet, usersPut, usersPost, usersDelete } from '../controller/users.controller';
import { isValidRole, isValidEmail, userByIdExists } from '../helpers';
import {validateFields} from '../middlewares/';

const router = Router();


//routes with middleware express validator included
router.get('/', usersGet );

router.put('/:id', [
    check('id', 'ID is not valid').isMongoId(),
    check('id').custom( userByIdExists ),    
    check('role').custom( isValidRole ),
    validateFields
],usersPut);

router.post('/', [
    //express validator
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Password is required and must have at least 6 characters').isLength({min: 6}),
    check('email', 'Email is not valid').isEmail(),
    // check('role', 'Role not valid').isIn(['user', 'admin']),
    check('email').custom( isValidEmail ),
    check('role').custom( isValidRole ),
    validateFields
],usersPost);

router.delete('/:id',[
    check('id', 'ID is not valid').isMongoId(),
    check('id').custom( userByIdExists ), 
    validateFields
], usersDelete);

export default router;