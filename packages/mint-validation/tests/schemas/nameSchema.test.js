import { nameSchema } from "../../src/schemas/name";

test("nameSchema returns an error when the name is empty", () => {
  const data = nameSchema.safeParse("");
  expect(data.success).toEqual(false);
});
