# Diff Viewer Chrome Extension

Injects @kittycad/lib powered visual diffs for supported CAD files in GitHub Pull Requests.

## Available Scripts

The project uses Vite, with Node 18, yarn 3 as package manager and TypeScript.

From the project directory:

### `yarn install`

Installs all the dependencies needed to build and test the project.

If needed: VS Code requires an additional step to make sure it works with Yarn PnP (more info [here](https://yarnpkg.com/getting-started/editor-sdks#vscode))

```
yarn dlx @yarnpkg/sdks vscode
```

### `yarn build`

Builds the extension for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The generated `build` directory may then be added to Chrome with the **Load unpacked** button at [chrome://extensions](). This needs to be done everytime there's a change.

### `yarn start`

Runs the extension in the development mode.

The generated `build` directory may then be added to Chrome with the **Load unpacked** button at [chrome://extensions](). Background/content scripts and React views should reload as changes are made.

### `yarn test`

Launches the unit tests runner in the interactive watch mode.

### `yarn e2e`

Builds the extension and runs end-to-end tests through an automated Chromium instance.

## Release a new version

1. Bump the versions in the source code by creating a new PR, committing the changes from

```bash
VERSION=x.y.z npm run bump
```

2. Merge the PR

3. Create a new release and tag pointing to the bump version commit using semantic versioning `v{x}.{y}.{z}`

A new Action should run, uploading artifacts to the release itself and to the Chrome Web Store at https://chrome.google.com/webstore/detail/kittycad-diff-viewer/gccpihmphokfjpohkmkbimnhhnlpmegp
