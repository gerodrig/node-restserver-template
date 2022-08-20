import express, { Express }  from 'express';
import cors from 'cors';
import {authRouter, userRouter} from '../routes/';
import { dbConnection } from '../database/config';


export class Server {
    app: Express;
    port: number | string;
    usersPath: string = '/api/users';
    authPath: string = '/api/auth';

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
    }

    //routes method
    routes(){
        this.app.use(this.authPath, authRouter);
        this.app.use(this.usersPath, userRouter);
    };

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Rest Server with typescript is running on port ${this.port}`);
        }).on('error', (err: Error) => {
            console.log(err);
        });
    }
}