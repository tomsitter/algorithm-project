// Utility functions for parsing data from various EMRs

function parseDate(emr, date) {
    return new Date(date);
}

function parseNum(emr, val) {
    return +val
}

module.exports = {
    'parseDate': parseDate,
    'parseNum': parseNum
}