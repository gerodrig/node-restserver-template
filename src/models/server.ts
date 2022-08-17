import express, { Express }  from 'express';
import cors from 'cors';
import router from '../routes/users.routes';


export class Server {
    app: Express;
    port: number | string;
    usersPath: string = '/api/users';

    constructor(){
        this.app = express();
        this.port = process.env.PORT || 3000;

        //middlewares
        this.middlewares();

        //call your routes method
        this.routes();
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
        this.app.use(this.usersPath, router);
    };

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Rest Server with typescript is running on port ${this.port}`);
        }).on('error', (err: Error) => {
            console.log(err);
        });
    }
}