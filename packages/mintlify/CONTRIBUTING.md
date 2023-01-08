# Running CLI Locally

Note - contributing requires `yarn` and it's recommended you install it as a global installation. If you don't have yarn installed already run `npm install --global yarn` in your terminal.

Run `yarn` or `yarn install` to install dependencies. Then, run `yarn link` once to link to your local version of the CLI in the npm global namespace (`npm ls --global`).

Build the CLI using `yarn build` or `yarn watch` to see your local changes reflected. Keep `yarn watch` running in a terminal for changes to be quickly and continuously reflected while developing.

To unlink, run `yarn unlink` in this directory.
