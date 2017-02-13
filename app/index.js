const fs = require('fs')
const d3 = require('d3')
const {dialog} = require('electron').remote

const {barChart} = require("./js/charts")
const {State} = require("./js/state")

var appState = new State();

// Main function to process data and produce chart
function plot(err, raw) {
    // Parse the CSV file and store it. This data will be automatically normalized based on the EMR dropdown
    appState.data = d3.csvParse(raw);

    // Create a bar chart from the indicator results for the selected condition
    d3.select("#d3-chart").datum(appState.results).call( barChart() );
}


/****  Set up event listeners on the UI ****/

const fileManagerBtn = document.getElementById('open-file-manager')
fileManagerBtn.addEventListener('click', () => {
    // when clicked, open a file picker dialog and pass the raw data to the "plot" function
    dialog.showOpenDialog({properties: ['openFile']}, (filename) => {
        if (filename === undefined) return;
        fs.readFile(filename[0], 'utf-8', plot);
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