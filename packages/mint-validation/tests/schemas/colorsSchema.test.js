import { colorsSchema } from "../../src/schemas/colors";

describe("colorsSchema", () => {
  test("returns an error when value is not a valid hexadecimal", () => {
    const data = colorsSchema.safeParse({ primary: "notHex" });
    expect(data.success).toEqual(false);
  });

  test("returns an error when random key is part of the colors schema", () => {
    const data = colorsSchema.safeParse({
      primary: "#F77777",
      randomKey: "notHex",
    });
    expect(data.success).toEqual(false);
  });

  test("returns one error per invalid value", () => {
    const data = colorsSchema.safeParse({
      primary: "notHex",
      light: "notHex",
    });
    expect(data.success).toEqual(false);
  });

  test("returns an error when one or more nested values are not valid", () => {
    const data = colorsSchema.safeParse({
      primary: "#EFEFEF",
      background: {
        dark: "notHex",
        light: "notHex",
      },
    });
    expect(data.success).toEqual(false);
  });

  test("returns error when symbol is not included", () => {
    const data = colorsSchema.safeParse({
      primary: "EFEFEF",
    });
    expect(data.success).toEqual(false);
  });

  test("works for uppercase and lowercase hexadecimals", () => {
    const data = colorsSchema.safeParse({
      primary: "#EFEFEF",
      secondary: "#efefef",
    });
    expect(data.success).toEqual(false);
  });
});
