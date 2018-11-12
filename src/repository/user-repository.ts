import { User } from "../model/user";
import { Token } from "../model/token";

export interface UserRepository {
  resolve(id: number): Promise<User>;
  fromUid(uid: string): Promise<User>;
  fromToken(token: string): Promise<User>;
  createToken(user: User, token: string): Promise<number>;
}
