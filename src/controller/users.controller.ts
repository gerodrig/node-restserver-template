import { Response, Request } from 'express';

export const usersGet = (req: Request, res: Response) => {


    //extract params
    const { q, name , apikey, page = 1, limit = 10 } = req.query;

    res.json({
        message: 'Rest API with typescript GET',
        q,
        name,
        apikey, 
        page,
        limit
    });
}

export const usersPut = (req: Request, res: Response) => {

    const { id } = req.params;

    res.json({
        id
    });
}

export const usersPost = (req: Request, res: Response) => {

    const { name, age } = req.body;

    res.json({
        name,
        age
    });
}

export const usersDelete = (req: Request, res: Response) => {
    res.json({
        message: 'Rest API with typescript DELETE'
    });
}

