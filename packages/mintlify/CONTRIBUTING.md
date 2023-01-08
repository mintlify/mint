# Running CLI Locally

Note - contributing requires `yarn` and it's recommended you install it as a global installation. If you don't have yarn installed already run `npm install --global yarn` in your terminal.

Run `yarn` or `yarn install` to install dependencies. Then, run `yarn local` once to link to your local version of the CLI in the npm global namespace (`npm ls --global`).

Build the CLI using `yarn build` or `yarn watch`. Any local changes you make will be reflected in the CLI.

To unlink, run `npm uninstall --global mintlify`.
