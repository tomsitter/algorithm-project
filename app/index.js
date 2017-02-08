const fs = require('fs');
const {dialog} = require('electron').remote;

const d3 = require("d3");
const parsers = require("./js/parsers");
const charts = require("./js/charts");
   
const fileManagerBtn = document.getElementById('open-file-manager')

var state = {
  'emr': 'pss',
  'condition': 'diabetes'
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
  if (state.condition=='diabetes') {
    return normalizeDiabetes(row)
  }
}

function normalizeDiabetes(row) {
  record = {};
  for (let [emrKey, mapper] of entries(diabetesMap[state.emr])) {
    record[mapper.key] = mapper.parse(state.emr, row[emrKey])
  }
    
  return record
}

diabetesMap = {
  "pss": {
    "Date Hb A1C": { 
      "key": "Date Hb A1C",
      "parse": parsers.parseDate
    },
    "Date LDL": {
      "key": "Date LDL",
      "parse": parsers.parseDate
    },
    "DM Months": {
      "key": "DM Months",
      "parse": parsers.parseNum
    }
  }
}

function* entries(obj) {
   for (let key of Object.keys(obj)) {
     yield [key, obj[key]];
   }
}

