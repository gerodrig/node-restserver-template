import { Router } from 'express';
import { search } from '../controller/search.controller';

export const router = Router();


router.get('/:collection/:term', search)


export default router; 