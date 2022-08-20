import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const generateJWT = async (uid: string = '') => {
  return new Promise((resolve, reject) => {
    const payload = {uid};

    jwt.sign( payload, process.env.JWT_SECRET as string, { expiresIn: '4h' }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    }
    );
  });
};
