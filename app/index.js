const fs = require('fs');
const {dialog} = require('electron').remote

const d3 = require("d3");

state = {
  'emr': 'pss',
  'condition': 'diabetes'
}

const charts = require("./js/charts")
const normalize = require("./js/normalize")(state)
const indicators = require("./js/indicators")(state)

const fileManagerBtn = document.getElementById('open-file-manager')

fileManagerBtn.addEventListener('click', () => {
    dialog.showOpenDialog({properties: ['openFile']}, (filename) => {
        if (filename === undefined) return;
        fs.readFile(filename[0], 'utf-8', plot);
    })
})

function plot(err, raw) {
    /* To plot the raw data we have to:
    1) Parse it
    2) Normalize it
    3) Apply the appropriate indicators
    4) Plot the results from the analysis
    */
    let data = d3.csvParse(raw, normalize.normalizeData);

    let results = indicators.process(data);

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

    // let dmMonths = data.map(function(a) {return a["DM Months"];});
    
    let exampleChart = charts.barChart();
    d3.select("#d3-chart").datum(results).call(exampleChart);
}