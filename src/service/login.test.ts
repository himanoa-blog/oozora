import { verifyToken, TokenPayload } from "./login";
import { Certs } from "../ext/oauth";

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
    getToken: (code: string): Promise<string> =>
      Promise.resolve(`${dummyEnvelope}.a.a`),
    getCerts: (): Promise<Certs> => Promise.resolve(dummyCerts),
    decoder: (_token: string, _n: string, _alg: string): any => ({ sub: "a" })
  };
  const actual = await verifyToken(req, dep);
  expect(actual).toEqual({sub: "a"});
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
    decoder: (_token: string, _n: string, _alg: string): any => { sub: "a" }
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
    decoder: (_token: string, _n: string, _alg: string): any => {sub: "a"}
  };
  const actual = verifyToken(req, dep);
  await expect(actual).rejects.toThrow();
});
