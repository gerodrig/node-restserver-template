import { Router } from 'express';
import { check } from 'express-validator';

import { validateFields } from '../middlewares';
import { googleSignIn, login, validateToken } from '../controller/auth.controller';
import { validateJWT } from '../middlewares/validate-jwt';

const router = Router();


//routes with middleware express validator included
router.post('/login',[
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    validateFields
], login );

router.post('/google',[
    check('id_token', 'Google id token is required').not().isEmpty(),
    validateFields
], googleSignIn );

//validate token
router.get('/',[
    validateJWT
], validateToken);




export default router;