> [!IMPORTANT]  
> The extension in its current form has been temporarily unpublished from the store. A rewrite leveraging more modern Zoo APIs and integrating properly with Github's new UI is needed before it can be published again. The work for this will be tracked at https://github.com/KittyCAD/diff-viewer-extension/issues/743. Sorry for any inconvenience!

![Zoo](/public/logo192.png)

## Zoo Diff Viewer Extension

View changes to your models directly within GitHub with our extension for all Chrome, Edge, and Chromium-powered browsers. Use the industry-standard version control platform, supercharged with a rich CAD visualizer. Open-source and powered by the KittyCAD API.

### Review model changes visually

Upload your models to GitHub and make safe, incremental changes to them with a full version history. And with our extension, you can now visually review your model with clear indications of what has changed between versions. Our extension overrides some of the GitHub interface to provide you with a full 3D view of your files, and two review modes:

- 2-up view: For when you just need to see the before and after state of the model; and
![2-up view](/public/diff-viewer-2-up.jpg)

- Combined view (experimental): See the additions, deletions, and unchanged portions of your model in one 3D viewer.

![Combined view](/public/diff-viewer-combined.jpg)

## Try it now

Live on the [Google Chrome Store](https://chrome.google.com/webstore/detail/kittycad-diff-viewer/gccpihmphokfjpohkmkbimnhhnlpmegp).

## Running a development build

The project uses Vite, with Node 18, yarn 3 as package manager and TypeScript.

From the project directory:

### `yarn install`

Installs all the dependencies needed to build and test the project.

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
