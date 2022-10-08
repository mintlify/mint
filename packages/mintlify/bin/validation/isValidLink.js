export default function isValidLink(href) {
    // This checks the link is written correctly, not that the page exists.
    try {
        new URL(href);
        return true;
    }
    catch (_) {
        return false;
    }
}
//# sourceMappingURL=isValidLink.js.map