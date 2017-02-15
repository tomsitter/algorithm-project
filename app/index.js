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
        appState.data = processAccuro(raw)
    } else {
        appState.data = d3.csvParse(raw);
    }
    
    
    
}

function plot(results) {
    let barChart = charts.barChart();
    d3.select("#d3-chart").datum(appState.results).call(barChart);
}

function processAccuro(raw) {
    // Accuro uses generic column names (e.g. "Collection Date", "Value")
    // and uses a column ("Lab Type") to say what type of lab value is in the following two columns
    // we need to find all of the "Lab Type" columns, read the type, and rename the following two columns 
    let dataArray = d3.csvParseRows(raw)

    // Get the first row of the data array, which is the column names
    let rawHeader = dataArray.splice(0, 1).pop()
    // Make a copy of it that we can edit with the new column names
    let newHeader = []

    // Loop through each column name and if "Lab Type" is found, get the most frequent occurence
    // Use this lab type to rename subsequent appearances of "Collection Date" and "Value" until 
    // the next "Lab Type" is found
    let currentLabType = null
    rawHeader.map((column, index) => {
        var cleanedColumn = column.trim().replace(/"/g, '')
        switch(cleanedColumn) {
            case 'Lab Type':
                currentLabType = mode(dataArray.map((arr) => {return arr[index]})).trim()
                newHeader.push(`${cleanedColumn}${index}`)
                break;
            case 'Collection Date':
                if (currentLabType) newHeader.push(`Date ${currentLabType}`)
                break;
            case 'Value':
                if (currentLabType) {
                    if (currentLabType) newHeader.push(`${currentLabType}`)
                }
                break;
            default:
                newHeader.push(cleanedColumn)
        }
    })

    return rowsToObjects([[newHeader], ...dataArray])
}

function mode(array)
{
    if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

function rowsToObjects(table) {
  var keys = table[0],
      rows = table.slice(1);

  if(rows.length === 0) return [];

  return rows.map(function (row) {
    return keys.reduce(function (memo, key, index) {
      memo[key] = row[index];
      return memo;
    }, {});
  });
}