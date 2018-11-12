import { UserRepository } from "./user-repository";
import { User } from "../model/user";
import { Token } from "../model/token";
import * as mysql from "promise-mysql";

export class MySqlUserRepository implements UserRepository {
  constructor(private readonly conn: mysql.Pool) {}

  async resolve(id: number): Promise<User> {
    const query = "SELECT * from `users` WHERE `id`=? LIMIT 1;";
    const result = (await this.conn.query(query, [id]))[0];
    return {
      id: result.id,
      name: result.name,
      uid: result.uid,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    };
  }

  async fromUid(uid: string): Promise<User> {
    const query = "SELECT * from `users` WHERE `uid`=? LIMIT 1;";
    const result = (await this.conn.query(query, [uid]))[0];
    return {
      id: result.id,
      name: result.name,
      uid: result.uid,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    };
  }

  async fromToken(token: string): Promise<User> {
    const query =
      "SELECT * FROM `tokens` JOIN `users` ON `users`.`id`=`tokens`.`user_id` WHERE `token`=? LIMIT 1;";
    const result = (await this.conn.query(query, [token]))[0];
    return {
      id: result.id,
      name: result.name,
      uid: result.uid,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    };
  }

  async createToken(user: User, token: string): Promise<number> {
    const insertQuery =
      "INSERT INTO `tokens` (`user_id`, `token`) VALUES (?, ?)";
    return (await this.conn.query(insertQuery, [user.id, token]))[0]
      .affechedRows as number;
  }
}
