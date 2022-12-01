import { navigationConfigSchema } from "../../src/schemas/navigation";

test("navigationSchema returns an error when navigation is empty", () => {
  const data = navigationConfigSchema.safeParse([]);
  expect(data.success).toEqual(false);
});

test("navigationSchema returns an error when navigation is undefined", () => {
  const data = navigationConfigSchema.safeParse();
  expect(data.success).toEqual(false);
});

test("navigationSchema returns an error when navigation is undefined", () => {
  const data = navigationConfigSchema.safeParse();
  expect(data.success).toEqual(false);
});

test("navigationSchema returns an error when pages is empty", () => {
  const data = navigationConfigSchema.safeParse({
    group: "1",
    pages: "",
  });
  expect(data.success).toEqual(false);
});

test("navigationSchema returns an error when pages is an empty string", () => {
  const data = navigationConfigSchema.safeParse({
    group: "1",
    pages: "",
  });
  expect(data.success).toEqual(false);
});

test("navigationSchema returns an error when pages is an empty array", () => {
  const data = navigationConfigSchema.safeParse({
    group: "1",
    pages: [],
  });
  expect(data.success).toEqual(false);
});
