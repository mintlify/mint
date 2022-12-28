import { nameSchema } from "../../src/schemas/name";

describe("nameSchema", () => {
  test("returns an error when the name is empty", () => {
    const data = nameSchema.safeParse("");
    expect(data.success).toEqual(false);
  });
});
