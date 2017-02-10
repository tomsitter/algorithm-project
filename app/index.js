const fs = require('fs')
const d3 = require('d3')
const {dialog} = require('electron').remote

const charts = require("./js/charts")

const {State} = require("./js/state")

<<<<<<< HEAD
var appState = new State();
const normalize = require("./js/normalize")(appState)
=======
const charts = require("./js/charts")
const normalize = require("./js/normalize")(state)
const indicators = require("./js/indicators")(state)
>>>>>>> a4d7603477b70d7e69fc81a600c1d6f3e405a95b

const fileManagerBtn = document.getElementById('open-file-manager')

fileManagerBtn.addEventListener('click', () => {
    dialog.showOpenDialog({properties: ['openFile']}, (filename) => {
        if (filename === undefined) return;
        fs.readFile(filename[0], 'utf-8', plot);
    })
})

const emrDropdown = document.getElementById('emr')

emrDropdown.addEventListener('change', (evt) => {
    console.log(evt.target.value);
    appState.emr = evt.target.value;
})

const conditionDropdown = document.getElementById('condition')

conditionDropdown.addEventListener('change', (evt) => {
    console.log(evt.target.value);
    appState.condition = evt.target.value;
})

function plot(err, raw) {
    /* To plot the raw data we have to:
    1) Parse and normalize it
    2) Apply the appropriate indicators
    3) Plot the results from the analysis
    */    
    appState.patients = d3.csvParse(raw, normalize.normalizeData);
    
    let exampleChart = charts.barChart();
    d3.select("#d3-chart").datum(appState.results).call(exampleChart);

    /* 
    results = {
        'dmMonths': {
            desc,
            longDesc,
            result: {
                'passed': 100,
                'failed': 50,
                'na': 6
            }
        },
        ...
    }
    */
}