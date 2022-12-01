import { faviconSchema } from "../../src/schemas/favicon";

test("faviconSchema returns an error when is of type .ico", () => {
  const data = faviconSchema.safeParse("randomIcon.ico");
  expect(data.success).toEqual(false);
});
