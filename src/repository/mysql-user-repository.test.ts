import { MySqlUserRepository } from "./mysql-user-repository";
import pool from "../infra/database/mysql";

async function dbClean() {
  await pool.query("DELETE FROM `users`;");
  await pool.query("DELETE FROM `tokens`;");
}
beforeEach(dbClean);
afterAll(dbClean);

describe("resolve", () => {
  describe("指定されているのがIDの場合", () => {
    test("正しく取得できること", async () => {
      const id = 1;
      const name = "himanoa";
      const uid = "asd";
      await pool.query(
        "INSERT INTO `users` (`id`, `name`, `uid`) VALUES (?, ?, ?)",
        [id, name, uid]
      );
      const actual = await new MySqlUserRepository(pool).resolve(id);
      expect(actual.id).toBe(id);
      expect(actual.name).toBe(name);
      expect(actual.uid).toBe(uid);
    });
  });
});
