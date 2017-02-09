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

module.exports = function(state) {
    let module = {}

    module.normalizeData = function(row) {
        if (state.condition=='diabetes') {
            return normalizeDiabetes(state.emr, row)
        }
    }

    return module
}