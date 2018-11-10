import { login } from "./login-request";

test("LoginUserが返ってくること", async () => {
  const request = {
    state: "a",
    code: "a"
  } 
  const actual = await login(request);
  actual.map(a => expect(a).toEqual({
    id: 1,
    token: "dummy",
    name: "himanoa"
  }))
})
