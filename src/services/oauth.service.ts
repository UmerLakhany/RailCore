import { OAuth2Client } from "google-auth-library";
import axios from 'axios';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class OAuthService {

  static async verifyGoogleToken(token: string): Promise<any> {
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.log("erroooorr", error)
      throw new Error('Invalid Google token');
    }
  }

  static async verifyFacebookToken(access_token: string) {
    const fbUserInfoUrl = `https://graph.facebook.com/me?fields=id,first_name,last_name,email,picture&access_token=${access_token}`;
    const response = await axios.get(fbUserInfoUrl);
    const fbData: any = response.data;
    if (fbData.error) {
      return null;
    }
    return fbData;
  }
}

export default OAuthService;