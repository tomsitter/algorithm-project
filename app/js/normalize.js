const parsers = require("./parsers")

parseMap = {
  "pss": {
    "Date Hb A1C": { 
      "key": "Date Hb A1C",
      "parse": parsers.parseDate
    },
    "Date LDL": {
      "key": "Date LDL",
      "parse": parsers.parseDate
    },
    "Report Date": {
      "key": "Report Date",
      "parse": parsers.parseDdMmYyyyDate
    },
    "Last DM Visit": {
      "key": "Last DM Visit",
      "parse": parsers.parseDate
    },
    "Hb A1C": {
      "key": "Hb A1C",
      "parse": parsers.parseHbA1c
    }
  }
}

function* entries(obj) {
   for (let key of Object.keys(obj)) {
     yield [key, obj[key]]
   }
}

let normalizeData = (emr, data) => {
    return data.map((row) => normalizeRow(parseMap[emr], row))
}

let normalizeRow = (parseMap, row) => {
  record = {}
  for (let [emrKey, mapper] of entries(parseMap)) {
    if (row.hasOwnProperty(emrKey)) {
      record[mapper.key] = mapper.parse(row[emrKey])
    }
  }
  return record
}

module.exports = {
  normalizeData
}