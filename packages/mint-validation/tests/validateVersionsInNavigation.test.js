import {
  validateVersionsInNavigation,
  flattenNavigationVersions,
} from "../src/utils/validateVersionsInNavigation";

describe("validateVersionsInNavigation", () => {
  test("returns no error when there's no versions", () => {
    const results = validateVersionsInNavigation([
      {
        group: "1",
        pages: "",
      },
    ]);
    expect(results.errors.length).toEqual(0);
  });

  test("returns error when the navigation versions is not in the versions array", () => {
    const results = validateVersionsInNavigation(
      [
        {
          group: "1",
          pages: "",
          version: "2",
        },
      ],
      ["1"]
    );
    expect(results.errors.length).toEqual(1);
  });
});

describe("flattenNavigationVersions", () => {
  test("returns the correct values", () => {
    const data = flattenNavigationVersions([
      {
        group: "1",
        pages: "",
        version: "1",
      },
    ]);
    expect(data).toEqual(["1"]);
  });

  test("returns empty when there's no versions", () => {
    const data = flattenNavigationVersions([
      {
        group: "1",
        pages: "",
      },
    ]);
    expect(data).toEqual([]);
  });

  test("returns recursive version values", () => {
    const data = flattenNavigationVersions([
      {
        group: "1",
        pages: [
          {
            group: "1a",
            pages: [
              {
                group: "1b",
                pages: "pageString",
                version: "2",
              },
            ],
            version: "3",
          },
        ],
        version: "1",
      },
    ]);
    expect(data).toEqual(["1", "3", "2"]);
  });
});
