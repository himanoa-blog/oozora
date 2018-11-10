import { Either, left, right } from "fp-ts/lib/Either";
import { LoginUser } from "./login-user";

export interface LoginRequest {
  state: String;
  code: String
}

export async function login(_req: LoginRequest): Promise<Either<Error, LoginUser>> {
  return right<Error, LoginUser>({
    id: 1,
    token: "dummy",
    name: "himanoa"
  })
}
