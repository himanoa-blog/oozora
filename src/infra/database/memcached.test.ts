import { promisify } from "util";
import conn from "./memcached";

test("コネクションを取得しmemcachedと通信できること", async () => {
  await promisify<string, string, number>(conn.set).bind(conn)(
    "test",
    "foo",
    100
  );
  await expect(promisify<string>(conn.get).bind(conn)("test")).resolves.toEqual(
    "foo"
  );
});
