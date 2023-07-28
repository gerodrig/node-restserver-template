import { Request, Response } from 'express';

import { comparePassword, generateJWT, googleVerify } from '../helpers';
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
        message: 'Invalid Credentials',
      });
    }

    const userResponse = {
      uid: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      isActive: user.isActive,
    };
    
    //Generate JWT
    const token = await generateJWT(user._id.toString());

    return res.json({
      message: 'Login Ok',
      user: userResponse,
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

export const googleSignIn = async (req: Request, res: Response) => {
  const { id_token } = req.body;

  try{
    const {email, name, image} = await googleVerify(id_token);

    let user = await User.findOne({
      email: { $regex: new RegExp(email, 'i') },
    });

    //create new user if not exists
    if(!user){
      const data  = {
        name,
        email,
        image,
        password: 'google',
        role: 'user',
        google: true,
      }

      user = new User(data);

      //save in database
     //await user.save();
    }

    //if user in db is not active throw error
    if(!user.isActive){
      return res.status(401).json({
        ok: false,
        message: 'User is not active, please contact the administrator'
        });
    }

    //generate JWT
    const token = await generateJWT(user._id.toString());

    res.json({
      message: 'Google sign in Ok',
      email: user.email,
      token
    });

  } catch(error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: 'Token could not be verified'
  });

}


}

export const validateToken = async (req: any, res: Response) => {

 //generate new JWT
  const token = await generateJWT(req.user.uid);


  res.json({
    user: req.user,
    token
  });
}
