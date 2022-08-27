const {OAuth2Client} = require('google-auth-library');
import 'dotenv/config';


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleVerify = async function verify(token: string = '') {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const {name, picture, email} = ticket.getPayload();
  

  return {
        name,
        image: picture,
        email,
    };
//   const userid = payload['sub'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}
