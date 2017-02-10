const parsers = require("./parsers")

function normalizeDiabetes(emr, row) {
  record = {};
  for (let [emrKey, mapper] of entries(diabetesMap[emr])) {
    record[mapper.key] = mapper.parse(emr, row[emrKey])
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
     yield [key, obj[key]]
   }
}

// function normalizeData(data) {
//   if (this.condition=='diabetes') {
//     return data.map(row, normalizeDiabetes(this.emr, row))
//   }
// }

let normalizeData = (emr, condition, data) => {
  if (condition=='diabetes') {
    return data.map((row) => normalizeDiabetes(emr, row))
  }
}

module.exports = {
  normalizeData
}