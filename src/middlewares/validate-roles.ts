import { Response, NextFunction} from 'express';

export const isAdminRole = (req: any, res: Response, next: NextFunction) => {

    const {role, name } = req.user;

    if(!role){
        return res.status(500).json({
            message: 'User role is undefined, token has not been verified'
        });
    }
        
    //check if user is admin or super-admin if not return error
    if (role !== 'admin' && role !== 'super-admin') {
        return res.status(401).json({
            message: `User: ${name} is not authorized to perform delete action`,
        });
    }
    next();
}

//custom validator to check roles
export const hasRoles = (...roles: string[]) => {

    return (req: any, res: Response, next: NextFunction) => {

        if(!req.user){
            return res.status(500).json({
                message: 'User role is undefined, token has not been verified'
            });
        }

        if(!roles.includes(req.user.role)){
            return res.status(401).json({
                message: `The service requires one of the following roles: ${roles.join(', ')}`,
            });
        }

        next();
    }

}