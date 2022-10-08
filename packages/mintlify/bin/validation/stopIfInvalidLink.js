import isValidLink from "./isValidLink.js";
export default function stopIfInvalidLink(href) {
    if (!isValidLink(href)) {
        console.log("Invalid link: " + href);
        console.log("Make sure the link starts with http:// or https://");
        process.exit(1);
    }
}
//# sourceMappingURL=stopIfInvalidLink.js.map