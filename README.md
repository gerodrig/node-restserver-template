<p align="center">
  <a href="https://nodejs.dev/en/" target="blank"><img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" width="200" alt="Node Logo" /></a>
</p>

# Node JS Server based in classes

### The following code is a simple example of a node server without classes:

```
import express, { Request, Response } from 'express';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;

const app = express();

//configure public folder
app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Rest Server with TypeScript');
});

app.listen(PORT, () => {
    console.log(`Rest Server with typescript is running on port ${PORT}`);
}).on('error', (err: Error) => {
    console.log(err);
});
```


### Prepare the node server with classes
1. Create the models folder and server.ts file
```
import express, { Request, Response, Express }  from 'express';


export class Server {
    app: Express;
    port: number | string;

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
    }

    //routes method
    routes(){
        this.app.get('/api', (req: Request, res: Response) => {
            res.send('Hello Rest Server with TypeScript');
        });
    };

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Rest Server with typescript is running on port ${this.port}`);
        }).on('error', (err: Error) => {
            console.log(err);
        });
    }
}
```

## We can define the routes middleware as follows

### in the server class
```
import router from '../routes/user.routes';

 //routes method
    routes(){
        this.app.use('/api/users', router);
    };
```

### We define a separate routes folder including ```user.routes.ts```

```
import { Router, Request, Response } from 'express';

const router = Router();


router.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Rest API with typescript GET'
    });
});

router.put('/', (req: Request, res: Response) => {
    res.json({
        message: 'Rest API with typescript PUT'
    });
});

router.post('/', (req: Request, res: Response) => {
    res.status(206).json({
        message: 'Rest API with typescript POST'
    });
});

router.delete('/', (req: Request, res: Response) => {
    res.json({
        message: 'Rest API with typescript DELETE'
    });
});

export default router;
```

### We can also define our controllers in a controller folder in a file ```users.controller.ts```

```
import { Response, Request } from 'express';

export const usersGet = (req: Request, res: Response) => {
    res.json({
        message: 'Rest API with typescript GET'
    });
}

export const usersPut = (req: Request, res: Response) => {
    res.json({
        message: 'Rest API with typescript PUT'
    });
}

export const usersPost = (req: Request, res: Response) => {
    res.status(206).json({
        message: 'Rest API with typescript POST'
    });
}

export const usersDelete = (req: Request, res: Response) => {
    res.json({
        message: 'Rest API with typescript DELETE'
    });
}

```

With this we are separating our controllers from our routes to have a leaner routes file.