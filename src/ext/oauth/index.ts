export interface Cert {
  alg: string;
  n: string;
  use: string;
  kid: string;
  e: string;
  kty: string;
}
export interface Certs {
  keys: Cert[];
}

export interface ClientOption {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  grantType?: string;
  tokenUrl: string;
  certsUrl: string;
}

export interface Client {
  getToken: (code: string) => Promise<string>;
  getCert: () => Promise<Certs>;
}
