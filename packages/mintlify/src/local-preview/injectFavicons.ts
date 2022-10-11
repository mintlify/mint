import favicons from "favicons";
import { promises as _promises } from "fs";
import { outputFile } from "fs-extra";
import { join } from "path";
import { CLIENT_PATH, CMD_EXEC_PATH } from "../constants.js";

const { readFile } = _promises;

export const injectFavicons = async (configObj, logger) => {
  if (configObj?.favicon == null) return;

  const desiredPath = join(CMD_EXEC_PATH, configObj.favicon);
  const favicon = await readFile(desiredPath);
  if (favicon == null) return;
  logger.start("Generating favicons...");
  const promises = [];
  try {
    const response = await favicons(favicon, faviconConfig(configObj?.name));
    response.images.forEach((img) => {
      promises.push(
        (async () => {
          const targetPath = join(CLIENT_PATH, "public", "favicons", img.name);
          await outputFile(targetPath, Buffer.from(img.contents), {
            flag: "w",
          });
        })()
      );
    });
    response.files.forEach((file) => {
      promises.push(
        (async () => {
          const targetPath = join(CLIENT_PATH, "public", "favicons", file.name);
          await outputFile(targetPath, file.contents, { flag: "w" });
        })()
      );
    });
    await Promise.all(promises);
    logger.succeed("Favicons generated");
  } catch (err) {
    console.log(err.message); // Error description e.g. "An unknown error has occurred"
  }
};

const faviconConfig = (name) => ({
  path: "/favicons", // Path for overriding default icons path. `string`
  appName: name, // Your application's name. `string`
  appShortName: name, // Your application's short_name. `string`. Optional. If not set, appName will be used
  appDescription: null, // Your application's description. `string`
  developerName: null, // Your (or your developer's) name. `string`
  developerURL: null, // Your (or your developer's) URL. `string`
  dir: "auto", // Primary text direction for name, short_name, and description
  lang: "en-US", // Primary language for name and short_name
  background: "#fff", // Background colour for flattened icons. `string`
  theme_color: "#fff", // Theme color user for example in Android's task switcher. `string`
  appleStatusBarStyle: "black-translucent", // Style for Apple status bar: "black-translucent", "default", "black". `string`
  display: "standalone", // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
  orientation: "any", // Default orientation: "any", "natural", "portrait" or "landscape". `string`
  scope: "/", // set of URLs that the browser considers within your app
  start_url: "/?homescreen=1", // Start URL when launching the application from a device. `string`
  preferRelatedApplications: false, // Should the browser prompt the user to install the native companion app. `boolean`
  relatedApplications: undefined, // Information about the native companion apps. This will only be used if `preferRelatedApplications` is `true`. `Array<{ id: string, url: string, platform: string }>`
  version: "1.0", // Your application's version string. `string`
  logging: false, // Print logs to console? `boolean`
  pixel_art: false, // Keeps pixels "sharp" when scaling up, for pixel art.  Only supported in offline mode.
  loadManifestWithCredentials: true, // Browsers don't send cookies when fetching a manifest, enable this to fix that. `boolean`
  manifestMaskable: false, // Maskable source image(s) for manifest.json. "true" to use default source. More information at https://web.dev/maskable-icon/. `boolean`, `string`, `buffer` or array of `string`
  icons: {
    android: ["android-chrome-192x192.png", "android-chrome-256x256.png"],
    appleIcon: ["apple-touch-icon.png"],
    appleStartup: false,
    favicons: true,
    windows: ["mstile-150x150.png"],
    yandex: false,
    firefox: false,
  },
});
