import axios from "axios";
export const getSitemapLinks = async (url) => {
    const hostname = url.hostname.replace(".", "\\.");
    const regex = new RegExp(`https?:\/\/${hostname}.+?(?=<\/loc>)`, "gmi");
    try {
        const indexData = (await axios.default.get(url.href)).data;
        const array = indexData.match(regex);
        return array || [];
    }
    catch (err) {
        console.error(err);
        console.log("Skipping sitemap links because we encountered an error.");
        return [];
    }
};
//# sourceMappingURL=getSitemapLinks.js.map