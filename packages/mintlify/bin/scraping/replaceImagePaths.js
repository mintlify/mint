export default function replaceImagePaths(origToWritePath, cliDir, markdown) {
    if (origToWritePath == null) {
        return markdown;
    }
    // Change image paths to use the downloaded locations
    for (const [origHref, writePath] of Object.entries(origToWritePath)) {
        // Use relative paths within the folder we are in
        if (writePath.startsWith(cliDir)) {
            markdown = markdown.replaceAll(origHref, writePath.slice(cliDir.length));
        }
        else {
            markdown = markdown.replaceAll(origHref, writePath);
        }
    }
    return markdown;
}
//# sourceMappingURL=replaceImagePaths.js.map