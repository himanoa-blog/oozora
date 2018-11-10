import pool from "./mysql";

test("コネクションを取得しmysqlと通信できること", async () => {
  const actual = await pool.query("SHOW STATUS;");
  expect(actual.toString()).toBeDefined();
});
