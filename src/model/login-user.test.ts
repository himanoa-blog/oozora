import { parseLoginRequest } from "./login-request";

describe("parseLoginRequest", () => {
  test("正しい場合はLoginRequestを返すこと", () => {
    const actual: any = {
      state: "a",
      code: "a"
    }
    expect(parseLoginRequest(actual)[1]).toEqual(actual)
  })

  test("要素が欠けている場合は配列の0番目の要素がundefinedではないこと", () => {
    const actual: any = {
      state: "a",
    }
    expect(parseLoginRequest(actual)[0]).toBeDefined()
  })

  test("要素の型がおかしい場合も配列の0番目の要素がundefinedではないこと", () => {
    const actual: any = {
      state: 1,
      code: "a"
    }
    expect(parseLoginRequest(actual)[0]).toBeDefined()
  })
})
