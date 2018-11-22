import { LoginRequest } from "../model/login-request";
import { LoginUser } from "../model/login-user";
import { Cert, Certs } from "../ext/oauth";
import { UserRepository } from "../repository/user-repository";

export class LoginServiceException extends Error {
  public name = "LoginServiceException";

  constructor(public message: string) {
    super(message);
  }

  toStirng() {
    return `${this.name}:${this.message}`;
  }
}

export interface TokenPayload {
  sub: string;
}

export interface VerifyTokenDep {
  getToken: (code: string) => Promise<string>;
  getCerts: () => Promise<Certs>;
  decoder: (token: string, n: string, alg: any) => any;
}

export interface LoginDep {
  verifyTokenDep: VerifyTokenDep;
  generateToken: () => string;
  userRepository: UserRepository;
}

export const decodeBase64 = (str: string): string =>
  Buffer.from(str, "base64").toString("utf8");

export async function verifyToken(
  req: LoginRequest,
  dep: VerifyTokenDep
): Promise<TokenPayload> {
  const idToken = await dep.getToken(req.code);
  const certs = await dep.getCerts();
  const segments = idToken.split(".");
  if (segments.length <= 2)
    throw new Error("Segment length must be above the 2");
  const envelope = JSON.parse(decodeBase64(segments[0]));
  if (envelope.kid === undefined) throw new Error("kid is undefined");
  const key: Cert = certs.keys.find(
    (v: Cert) => v.kid === envelope.kid
  ) as Cert;
  return dep.decoder(idToken, key.n, key.alg);
}

export async function login(
  req: LoginRequest,
  dep: LoginDep
): Promise<LoginUser> {
  try {
    const { sub } = await verifyToken(req, dep.verifyTokenDep).catch(err => {
      throw err;
    });
    const user = await dep.userRepository.fromUid(sub).catch(err => {
      throw err;
    });
    const token = dep.generateToken();
    dep.userRepository.createToken(user, token);
    return {
      id: user.id,
      token,
      name: user.name
    };
  } catch (e) {
    throw new LoginServiceException(e.message);
  }
}
