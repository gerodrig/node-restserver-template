import express, { Express }  from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import {authRouter, userRouter, categoriesRouter, productsRouter, searchRouter, uploadsRouter} from '../routes/';
import { dbConnection } from '../database/config';

interface IPaths {
    [key: string]: string;
}


export class Server {
    app: Express;
    port: number | string;

    paths: IPaths = {
        auth: '/api/auth',
        users: '/api/users',
        categories: '/api/categories',
        products: '/api/products',
        search: '/api/search',
        uploads: '/api/uploads',
    }

    constructor(){
        this.app = express();
        this.port = process.env.PORT || 3000;

        //connect to database
        this.connectDb();

        //middlewares
        this.middlewares();

        //call your routes method
        this.routes();
    }

    async connectDb(){
        await dbConnection();
    }

    middlewares(){
        //public directory
        this.app.use(express.static('public'));

        //body read and parse
        this.app.use(express.json());

        //define CORS
        this.app.use(cors());

        //files upload
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath : true,
        }));
    }

    //routes method
    routes(){
        this.app.use(this.paths.auth, authRouter);
        this.app.use(this.paths.users, userRouter);
        this.app.use(this.paths.categories, categoriesRouter);
        this.app.use(this.paths.products, productsRouter);
        this.app.use(this.paths.search, searchRouter);
        this.app.use(this.paths.uploads, uploadsRouter);
    };

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Rest Server with typescript is running on port ${this.port}`);
        }).on('error', (err: Error) => {
            console.log(err);
        });
    }
}