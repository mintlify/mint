export const MintConfig = (
  name: string,
  color: string,
  ctaName: string,
  ctaUrl: string,
  filename: string
) => {
  return {
    name,
    logo: "",
    favicon: "",
    colors: {
      primary: color,
    },
    topbarLinks: [],
    topbarCtaButton: {
      name: ctaName,
      url: ctaUrl,
    },
    anchors: [],
    navigation: [
      {
        group: "Home",
        pages: [filename],
      },
    ],
    // footerSocials: {}, // support object type for footer tyoes
  };
};

export const Page = (
  title: string,
  description?: string,
  markdown?: string
) => {
  // If we are an empty String we want to add two quotes,
  // if we added as we went we would detect the first quote
  // as the closing quote.
  const startsWithQuote = title.startsWith('"');
  const endsWithQuote = title.startsWith('"');
  if (!startsWithQuote) {
    title = '"' + title;
  }
  if (!endsWithQuote) {
    title = title + '"';
  }

  const optionalDescription = description
    ? `\ndescription: "${description}"`
    : "";
  return `---\ntitle: ${title}${optionalDescription}\n---\n\n${markdown}`;
};
