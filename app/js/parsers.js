// Utility functions for parsing data from various EMRs

function parseDate(date) {
    return new Date(date);
}

function parseDdMmYyyyDate(date) {
    // Some dates are in dd/mm/yyyy format
    // We can split and reverse them to pass as Date(yyyy, mm, dd)
    ddMmYyyy = date.split("/")
    //Months are 0 based in 
    ddMmYyyy[1] -= 1

    return new Date(...ddMmYyyy.reverse())
}

function parseNum(val) {
    return +val
}

module.exports = {
    parseDate,
    parseDdMmYyyyDate,
    parseNum
}