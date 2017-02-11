// Utility functions for parsing data from various EMRs

function parseDate(date) {
    return new Date(date);
}

function parseDdMmYyyyDate(ddMmYyyy) {
    // Some dates are in dd/mm/yyyy format
    // We can split into array and reverse it to get [yyyy, mm, dd]
    let yyyyMmDd = ddMmYyyy.split("/").reverse()
    //Months are 0 based in JS so subtract 1
    yyyyMmDd[1] -= 1

    return new Date(...yyyyMmDd)
}

function parseNum(val) {
    return +val
}

module.exports = {
    parseDate,
    parseDdMmYyyyDate,
    parseNum
}