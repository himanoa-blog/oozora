import { verifyToken, TokenPayload } from "./login";
import { Certs } from "../ext/oauth";
import { UserRepository } from "../repository/user-repository";
import * as Login from "./login";

test("tokenVerify#期待したトークンが返ってくること", async () => {
  const req = { state: "dummy", code: "dummy" };
  const dummyEnvelope = Buffer.from(
    JSON.stringify({
      kid: "d"
    })
  ).toString("base64");
  const dummyCerts = {
    keys: [
      {
        alg: "a",
        n: "b",
        use: "c",
        kid: "d",
        e: "e",
        kty: "f"
      }
    ]
  };
  const dep = {
    getToken: (_code: string): Promise<string> =>
      Promise.resolve(`${dummyEnvelope}.a.a`),
    getCerts: (): Promise<Certs> => Promise.resolve(dummyCerts),
    decoder: (_token: string, _n: string, _alg: string): any => ({ sub: "a" })
  };
  const actual = await verifyToken(req, dep);
  expect(actual).toEqual({ sub: "a" });
});

test("tokenVerify#envelopeをsplitした時に2以下のlengthの場合例外を投げること", async () => {
  const req = { state: "dummy", code: "dummy" };
  const dummyEnvelope = Buffer.from(
    JSON.stringify({
      kid: "d"
    })
  ).toString("base64");
  const dummyCerts = {
    keys: [
      {
        alg: "a",
        n: "b",
        use: "c",
        kid: "d",
        e: "e",
        kty: "f"
      }
    ]
  };
  const dep = {
    getToken: (_code: string): Promise<string> =>
      Promise.resolve(`${dummyEnvelope}.a`),
    getCerts: (): Promise<Certs> => Promise.resolve(dummyCerts),
    decoder: (_token: string, _n: string, _alg: string): any => {
      sub: "a";
    }
  };
  const actual = verifyToken(req, dep);
  await expect(actual).rejects.toThrow();
});

test("tokenVerify#envelopeにkidがない場合は例外を投げること", async () => {
  const req = { state: "dummy", code: "dummy" };
  const dummyEnvelope = Buffer.from(JSON.stringify({})).toString("base64");
  const dummyCerts = {
    keys: [
      {
        alg: "a",
        n: "b",
        use: "c",
        kid: "d",
        e: "e",
        kty: "f"
      }
    ]
  };
  const dep = {
    getToken: (_code: string): Promise<string> =>
      Promise.resolve(`${dummyEnvelope}.a.a`),
    getCerts: (): Promise<Certs> => Promise.resolve(dummyCerts),
    decoder: (_token: string, _n: string, _alg: string): any => {
      sub: "a";
    }
  };
  const actual = verifyToken(req, dep);
  await expect(actual).rejects.toThrow();
});

describe("login", () => {
  const req = { state: "dummy", code: "dummy" };
  const dummyEnvelope = Buffer.from(JSON.stringify({kid: "d"})).toString("base64");
  const dummyCerts = {
    keys: [
      {
        alg: "a",
        n: "b",
        use: "c",
        kid: "d",
        e: "e",
        kty: "f"
      }
    ]
  };
  const vdep: Login.VerifyTokenDep = {
    getToken: (_code: string): Promise<string> =>
      Promise.resolve(`${dummyEnvelope}.a.a`),
    getCerts: (): Promise<Certs> => Promise.resolve(dummyCerts),
    decoder: (_token: string, _n: string, _alg: string): TokenPayload => ({
      sub: "a"
    })
  }
  const dummyRepository: UserRepository = {
    resolve: (id: number) => Promise.resolve({
      id,
      name: "himanoa",
      uid: "a",
      updatedAt: new Date(),
      createdAt: new Date()
    }),
    fromUid: (uid: string) => Promise.resolve({
      id: 1,
      name: "himanoa",
      uid,
      updatedAt: new Date(),
      createdAt: new Date()
    }),
    fromToken: (_token: string) => Promise.resolve({
      id: 1,
      name: "himanoa",
      uid: "a",
      updatedAt: new Date(),
      createdAt: new Date()
    }),
    createToken:(_u, _t) => Promise.resolve(1)
  }
  const dep: Login.LoginDep = {
    verifyTokenDep: vdep,
    generateToken: () => "a",
    userRepository: dummyRepository
  }

  test("ログインユーザーが返ってくること", async () => {
    const actual = await Login.login(req, dep)
    expect(actual).toStrictEqual({
      id: 1,
      name: "himanoa",
      token: "a"
    })
  })

  test("ユーザーIDが存在しない場合、例外を投げること", async () => {
    const repo = {
      ...dummyRepository,
      ...{
        fromUid: (_id: string) => { throw new Login.LoginServiceException("gomi") }
      }
    };
    const actual = Login.login(req, { ...dep, ...{ userRepository: repo } });
    await expect(actual).rejects.toEqual(new Login.LoginServiceException('gomi'))
  })
})
