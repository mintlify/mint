import { configSchema } from "../../src/schemas/config";

describe("configSchema", () => {
  test("works when only name, favicon, navigation, and colors are defined", () => {
    const data = configSchema.safeParse({
      name: "Name",
      favicon: "favicon.svg",
      colors: { primary: "#ff0000" },
      navigation: [{ group: "Group", pages: ["page"] }],
    });
    expect(data.success).toEqual(true);
  });

  test("works when defining a button cta", () => {
    const data = configSchema.safeParse({
      name: "Name",
      favicon: "favicon.svg",
      colors: { primary: "#ff0000" },
      navigation: [{ group: "Group", pages: ["page"] }],
      topbarCtaButton: {
        name: "Button",
        url: "/internal/link",
      },
      topbarLinks: [
        {
          name: "Link Text",
          url: "https://external.link",
        },
        {
          name: "Link Text",
          url: "/other/internal/link",
        },
      ],
    });
    expect(data.success).toEqual(true);
  });

  test("works when defining a GitHub cta", () => {
    const data = configSchema.safeParse({
      name: "Name",
      favicon: "favicon.svg",
      colors: { primary: "#ff0000" },
      navigation: [{ group: "Group", pages: ["page"] }],
      topbarCtaButton: {
        type: "github",
        url: "https://github.com/org/repo",
      },
    });
    expect(data.success).toEqual(true);
  });

  test("fails when GitHub cta is an invalid link", () => {
    const data = configSchema.safeParse({
      name: "Name",
      favicon: "favicon.svg",
      colors: { primary: "#ff0000" },
      navigation: [{ group: "Group", pages: ["page"] }],
      topbarCtaButton: {
        type: "github",
        url: "",
      },
    });
    expect(data.success).toEqual(false);
  });

  test("fails if user attempts to define injected property that's assigned internally", () => {
    const data = configSchema.safeParse({
      name: "Name",
      favicon: "favicon.svg",
      colors: { primary: "#ff0000" },
      navigation: [{ group: "Group", pages: ["page"] }],
      __injected: "any value",
    });
    expect(data.success).toEqual(false);
    expect(data.error.errors[0].message).toEqual(
      "Do not add __injected to mint.json. Mintlify uses this property internally."
    );
  });
});
