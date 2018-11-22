import { parseNewEntry } from "./new-entry";

describe("parseNewEntry", () => {
  test("正しくパースできること", async () => {
    const target = { title: "aaa", body: "fooo", published: true, userId: 10 };
    await expect(parseNewEntry(target)).resolves.toEqual(target);
  });

  test("titleが空の場合はエラーが返ること", async () => {
    const target = { title: "", body: "fooo", published: true, userId: 10 };
    await expect(
      parseNewEntry(target)
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"child \\"title\\" fails because [\\"title\\" is not allowed to be empty]"`
    );
  });

  test("bodyが空の場合はエラーが返ること", async () => {
    const target = { title: "aaa", body: "", published: true, userId: 10 };
    await expect(
      parseNewEntry(target)
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"child \\"body\\" fails because [\\"body\\" is not allowed to be empty]"`
    );
  });

  test("publishedが空の場合はエラーが返ること", async () => {
    const target = {
      title: "aaa",
      body: "aaaa",
      published: undefined,
      userId: 10
    };
    await expect(
      parseNewEntry(target)
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"child \\"published\\" fails because [\\"published\\" is required]"`
    );
  });
  test("userIdが空の場合はエラーが返ること", async () => {
    const target = {
      title: "aaa",
      body: "aaaa",
      published: true,
      userId: undefined
    };
    await expect(
      parseNewEntry(target)
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"child \\"userId\\" fails because [\\"userId\\" is required]"`
    );
  });
});
