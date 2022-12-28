import { versionsSchema } from "../../src/schemas/versions";

describe("versionsSchema", () => {
  test("returns an error when versions is declared but empty", () => {
    const data = versionsSchema.safeParse([]);
    expect(data.success).toEqual(false);
  });
});
