const fs = require('fs');
const {dialog} = require('electron').remote

const d3 = require("d3");

state = {
  'emr': 'pss',
  'condition': 'diabetes'
}

const charts = require("./js/charts")
const normalize = require("./js/normalize")(state)

const fileManagerBtn = document.getElementById('open-file-manager')

fileManagerBtn.addEventListener('click', () => {
    dialog.showOpenDialog({properties: ['openFile']}, (filename) => {
        if (filename === undefined) return;
        fs.readFile(filename[0], 'utf-8', plot);
    })
})

function plot(err, raw) {
    let data = d3.csvParse(raw, normalize.normalizeData);
    let dmMonths = data.map(function(a) {return a["DM Months"];});
    
    let exampleChart = charts.barChart();
    d3.select("#d3-chart").datum(dmMonths).call(exampleChart);
}