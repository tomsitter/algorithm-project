// Utility functions for parsing data from various EMRs

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
}

module.exports = {
    Parser
}