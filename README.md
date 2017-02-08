# algorithm-project
Desktop application for AFHTO's algorithm project

## Running for development and testing
Clone the Git repo, navigate into the directory and run `npm install`. Start the application by running `npm start`. 


## Packaging for distribution

To package the app for distribution, install electron-packager `npm install -g electron-packager` and package it `npm run package`. This will package it for the current OS.

To package for a different OS, run the appropriate package command:
```
npm run package-mac
npm run package-win
npm run package-linux
```

Then run the compiled file (e.g. for windows, run `release-builds/AlgorithmProject-<platform>-<arch>/AlgorithmProject.exe`)
