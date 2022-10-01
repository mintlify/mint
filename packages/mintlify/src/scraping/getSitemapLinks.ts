import axios from "axios";

export const getSitemapLinks = async (url: URL) => {
  const hostname = url.hostname.replace(".", "\\.");
  const regex = new RegExp(`https?:\/\/${hostname}.+?(?=<\/loc>)`, "gmi");

  try {
    const indexData = (await axios.default.get(url.href)).data as string;
    const array = indexData.match(regex) as string[] | null;
    return array || [];
  } catch (err) {
    console.error(err);
    console.log("Skipping sitemap links because we encountered an error.");
    return [];
  }
};
