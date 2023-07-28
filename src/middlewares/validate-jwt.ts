import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models';

export const validateJWT = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const token = (req.headers['x-token'] as string) || '';

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'No token provided',
    });
  }

  try {
    const {uid} = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as {uid: string};

    //read user that match with uid and add it to req.user
    const user = await User.findById(uid);

    //check if user exists
    if (!user) {
      return res.status(401).json({
        message: 'Invalid token - User does not exist in database',
      });
    }

    //check if user state is active
    if (!user?.isActive) {
      return res.status(401).json({
        message: 'Invalid token - User is not active',
      });
    }

    req.user = {
      uid,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      isActive: user.isActive,
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: 'Token is not valid',
    });
  }
};
