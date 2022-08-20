import { Request, Response } from 'express';

import { comparePassword, generateJWT } from '../helpers';
import { User } from '../models/';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    //Check if email exists case insensitive
    const user = await User.findOne({
      email: { $regex: new RegExp(email, 'i') },
    }).select('-google -image').lean().exec();

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'User not found',
      });
    }
    //Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        ok: false,
        message: 'User is not active',
      });
    }
    //Check if password is correct
    if (!comparePassword(password, user.password)) {
      return res.status(401).json({
        ok: false,
        message: 'Password is incorrect',
      });
    }
    
    //Generate JWT
    const token = await generateJWT(user._id.toString());

    return res.json({
      message: 'Login Ok',
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Server error, please contact the administrator',
    });
  }
};
