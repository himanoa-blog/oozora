import * as OAuth from "./";
import axios from "axios";

const defaultGrantType = "authorization_code";

interface Token {
  id_token: string;
}
export function createGoogleOAuthClient(opt: OAuth.ClientOption): OAuth.Client {
  return {
    async getToken(code) {
      const res = await axios.post<Token>(opt.tokenUrl, {
        client_id: opt.clientId,
        client_secret: opt.clientSecret,
        redirect_uri: opt.redirectUri,
        grant_type: opt.grantType || defaultGrantType,
        code
      });
      return res.data.id_token;
    },
    async getCert() {
      return (await axios.get<OAuth.Certs>(opt.certsUrl).catch()).data;
    }
  };
}
