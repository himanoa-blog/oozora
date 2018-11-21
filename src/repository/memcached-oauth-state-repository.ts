import { OAuthStateRepository } from "./oauth-state-repository"
import * as util from "util"
import Memcached from "memcached"

const expiredAt = 60 * 60 // -> 1時間

export class MemcachedOAuthStateRepository implements OAuthStateRepository {
  constructor(private readonly conn: Memcached) {}

  async exists(key: string): Promise<boolean> {
    const result = await util.promisify<string>(this.conn.get).bind(this.conn)(key)
    return !!result
  }

  async write(key: string): Promise<void> {
    util.promisify<string, boolean, number>(this.conn.set).bind(this.conn)(key, true, expiredAt)
  }
}
