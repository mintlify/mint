import { versionsSchema } from "../../src/schemas/versions";

test("versionsSchema returns an error when versions is declared but empty", () => {
  const data = versionsSchema.safeParse([]);
  expect(data.success).toEqual(false);
});

test("versionsSchema works when versions is not declared", () => {
  const data = versionsSchema.safeParse(undefined);
  expect(data.success).toEqual(true);
});
