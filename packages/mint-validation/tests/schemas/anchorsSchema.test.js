import { anchorsSchema } from "../../src/schemas/anchors";

describe("anchorsSchema", () => {
  test("accepts gradient color syntax", () => {
    const data = anchorsSchema.safeParse([
      { name: "a1", url: "someUrl", color: { from: "#00ff00", to: "#ff0000" } },
    ]);
    expect(data.success).toEqual(true);
  });

  test("errors on invalid colors", () => {
    const data = anchorsSchema.safeParse([
      { name: "a1", url: "someUrl", color: { from: "", to: "#ff0000" } },
    ]);
    expect(data.success).toEqual(false);
    expect(data.error.errors[0].message).toEqual(
      "Anchor color.from must be a hexadecimal color."
    );
  });

  test("returns an error when the url is missing", () => {
    const data = anchorsSchema.safeParse([
      { name: "a1", url: "" },
      { name: "a2", url: "someUrl" },
    ]);
    expect(data.success).toEqual(false);
  });

  test("should return an error for each url missing", () => {
    const data = anchorsSchema.safeParse([
      { name: "a1", url: "" },
      { name: "a2", url: "" },
    ]);
    expect(data.success).toEqual(false);
  });

  test("should returns success when everything is okay", () => {
    const data = anchorsSchema.safeParse([
      { name: "a1", url: "someRandomUrl" },
      { name: "a2", url: "someRandomUrl" },
    ]);
    expect(data.success).toEqual(true);
  });
});
