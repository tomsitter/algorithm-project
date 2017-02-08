const fs = require('fs');
const {dialog} = require('electron').remote;

const d3 = require("d3");
const parsers = require("./js/parsers");
const charts = require("./js/charts");
   
const fileManagerBtn = document.getElementById('open-file-manager')

var state = {
  'EMR': 'PSS'
}

fileManagerBtn.addEventListener('click', () => {
    dialog.showOpenDialog({properties: ['openFile']}, (filename) => {
        if (filename === undefined) return;
        fs.readFile(filename[0], 'utf-8', plot);
    })
})

function plot(err, raw) {
    let data = d3.csvParse(raw, normalizeData);
    let dmMonths = data.map(function(a) {return a["DM Months"];});
    
    let exampleChart = charts.barChart();
    d3.select("#d3-chart").datum(dmMonths).call(exampleChart);
}

function normalizeData(row) {
  if (state.EMR=="PSS") {
    row["Date Hb A1C"] = new Date(row["Date Hb A1C"])
    row["Date LDL"] = parsers.parseDate(state.EMR, row["Date LDL"])
    row["DM Months"] = +row["DM Months"]
  }
  return row
}

