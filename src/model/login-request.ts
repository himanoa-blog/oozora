export interface LoginRequest {
  state: string;
  code: string;
}

export function parseLoginRequest(v: any): [string?, LoginRequest?] {
  if('state' in v && 'code' in v) {
    if(typeof v.state === "string" && typeof v.code === "string") {
      return [undefined, {
        state: v.state,
        code: v.code
      }]
    }
  }
  return [`${JSON.stringify(v)}`, undefined]
}
