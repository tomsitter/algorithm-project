// Utility functions for parsing data from various EMRs

let d3 = require('d3')

class Parser {
     static parseDate(date) {
         return new Date(date);
    }

    static parseDdMmYyyyDate(ddMmYyyy) {
        // Some dates are in dd/mm/yyyy format
        // We can split into array and reverse it to get [yyyy, mm, dd]
        let yyyyMmDd = ddMmYyyy.split("/").reverse()
        //Months are 0 based in JS so subtract 1
        yyyyMmDd[1] -= 1

        return new Date(...yyyyMmDd)
    }

    static parseNum(val) {
        return +val
    }

    static parseHbA1c(val) {
        let labValue = parseFloat(val)
        if (labValue > 2) labValue /= 100
        return labValue
    }

    static returnValue(val) {
        return val
    }
}

function parseCSV(raw) {
    return d3.csvParse(raw)
}

function parseAccuroCSV(raw, stats) {
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

    // Add "Report Date" column
    newHeader.push("Report Date")
    let finalDataArray = dataArray.map((row) => { return row.concat(stats.birthtime)})

    return rowsToObjects([newHeader, ...finalDataArray])
}


// Utility Function
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

module.exports = {
    parseCSV,
    parseAccuroCSV,
    Parser
}