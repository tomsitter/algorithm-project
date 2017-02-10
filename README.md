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

## How to use the application?

1) Run and export one of AFHTO's indicator queries from your EMR to a CSV file
2) Open the application and select your EMR and the query you ran
3) Import your CSV file into the application
4) A chart will be created giving a quick overview of how many patients meet the clinical indicators for that condition

## How does it work?

When a CSV file is imported into the application it is parsed and normalized to a universal standard. The normalization step is important because every EMR exports data in a different way.  
Once normalized, a set of relevant indicators are ran against the data to determine whether the patients satisfy the indicator criteria or not. 
Some indicators may not apply to all patients in the CSV file and they will be excluded from the results.