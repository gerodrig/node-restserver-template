import { Router } from 'express';
import { check } from 'express-validator';

import { validateFields } from '../middlewares';
import { login } from '../controller/auth.controller';

const router = Router();


//routes with middleware express validator included
router.post('/login',[
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    validateFields
], login );




export default router;