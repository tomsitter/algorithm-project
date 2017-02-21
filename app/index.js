const fs = require('fs')
const d3 = require('d3')
const {dialog} = require('electron').remote

const {barChart} = require("./js/charts")
const {State} = require("./js/state")
const {parseAccuro} = require("./js/parsers")

var appState = new State();

/****  Set up event listeners on the UI ****/

const fileManagerBtn = document.getElementById('open-file-manager')
fileManagerBtn.addEventListener('click', () => {
    // when clicked, open a file picker dialog and pass the raw data to the "plot" function
    dialog.showOpenDialog({properties: ['openFile']}, (filename) => {
        if (filename === undefined) return;
        fs.readFile(filename[0], 'utf-8', process);
    })
})

const emrDropdown = document.getElementById('emr')
emrDropdown.addEventListener('change', (evt) => {
    // Update the app state when the EMR selection changes
    appState.emr = evt.target.value;
})

const conditionDropdown = document.getElementById('condition')
conditionDropdown.addEventListener('change', (evt) => {
    // Update the app state when the chronic condition selection changes
    appState.condition = evt.target.value;
})

function process(err, raw) {
    /* To plot the raw data we have to:
    1) Parse and normalize it
    2) Apply the appropriate indicators
    3) Plot the results from the analysis
    */   
    if (appState.emr == 'accuro') {
        appState.data = parseAccuro(raw)
    } else {
        appState.data = d3.csvParse(raw);
    }
    
    plot(appState.results)
    
}

// Main function to process data and produce chart
function plot(results) {
    // Create a bar chart from the indicator results for the selected condition
    d3.select("#d3-chart").datum(results).call( barChart() );
}