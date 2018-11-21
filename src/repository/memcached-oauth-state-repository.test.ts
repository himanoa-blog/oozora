import { MemcachedOAuthStateRepository } from "./memcached-oauth-state-repository"
import conn from "../infra/database/memcached"

test("データを保存して取得できること", async () => {
  const target = new MemcachedOAuthStateRepository(conn)
  await target.write("FOOBAR")
  await expect(target.exists("FOOBAR")).resolves.toEqual(true)
})
