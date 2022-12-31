import { navigationConfigSchema } from "../../src/schemas/navigation";

describe("navigationSchema", () => {
  test("returns an error when navigation is empty", () => {
    const data = navigationConfigSchema.safeParse([]);
    expect(data.success).toEqual(false);
  });

  test("returns an error when navigation is undefined", () => {
    const data = navigationConfigSchema.safeParse();
    expect(data.success).toEqual(false);
  });

  test("returns an error when pages is missing", () => {
    const data = navigationConfigSchema.safeParse([
      {
        group: "1",
      },
    ]);
    expect(data.success).toEqual(false);
  });

  test("returns an error when a page is an empty string", () => {
    const data = navigationConfigSchema.safeParse([
      {
        group: "1",
        pages: [""],
      },
    ]);
    expect(data.success).toEqual(false);
  });

  test("returns an error when pages is an empty array", () => {
    const data = navigationConfigSchema.safeParse([
      {
        group: "1",
        pages: [],
      },
    ]);
    expect(data.success).toEqual(false);
  });

  test("succeeds when using recursion", () => {
    const data = navigationConfigSchema.safeParse([
      {
        group: "1",
        pages: [
          {
            group: "2",
            pages: ["nested-page"],
          },
          "other-page",
        ],
      },
    ]);
    expect(data.success).toEqual(true);
  });
});
