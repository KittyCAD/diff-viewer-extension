# Diff Viewer Chrome Extension

Injects @kittycad/lib powered visual diffs for supported CAD files in GitHub Pull Requests.

## Available Scripts

The project was setup as a Create-React-App boilerplate, with Node 16, yarn 3 as package manager and TypeScript.

https://craco.js.org/ is used to extend the default CRA configs.

From the project directory:

### `yarn install`

Installs all the dependencies needed to build and test the project.

If needed: VS Code requires an additional step to make sure it works with Yarn PnP (more info [here](https://yarnpkg.com/getting-started/editor-sdks#vscode))

```
yarn dlx @yarnpkg/sdks vscode
```

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The generated `build` directory may then be added to Chrome with the **Load unpacked** button at [chrome://extensions](). This needs to be done everytime there's a change.

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

**This will only show the current settings popup in a tab, that won't be able to act as a Chrome extension, so it may only be used for pure UI work.**

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Release a new version

1. Bump the versions in the source code by creating a new PR, committing the changes from

```bash
VERSION=x.y.z npm run bump
```

2. Merge the PR

3. Create a new release and tag pointing to the bump version commit using semantic versioning `v{x}.{y}.{z}`

A new Action should run, uploading artifacts to the release itself and to the Chrome Web Store at https://chrome.google.com/webstore/detail/kittycad-diff-viewer/gccpihmphokfjpohkmkbimnhhnlpmegp
