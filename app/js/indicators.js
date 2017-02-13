/* 
Clinical indicators are contained within objects and operate on the normalized date.
Each indicator must have the following properties: 

- params: {}    An object of editable internal parameters used to calculate pass/fail of an indicator
- colNames: []  A list of columns that are required to calculate this rule
- desc: ()      A function that returns a short description of the indicator suitable for a chart label
- longDesc: ()  A function that returns a longer description of the indicator suitable for a tooltip or print out.
- rule: ()      A function that takes the parameters listed in colNames (order matters!) and returns one of 3 values:  
                1) true if the patient satisfies the indicator
                2) false if the patient fails the indicator
                3) NaN if the indicator does not apply to the patient

Indicators can then be further grouped into related sets of indicators that one would apply at the same time (i.e. a set of diabetes indicators)
*/
let applyIndicators = (condition, patients) => {
    results = []
    for (let indicator of getIndicatorsFor(condition)) {
        results.push({
            desc: indicator.desc,
            longDesc: indicator.longDesc,
            results: getResults(indicator.rule.bind(indicator), indicator.colNames, patients)
        })
    }
    return results;
}

let getIndicatorsFor = (condition) => {
    switch(condition) {
        case 'diabetes':
            return diabetesIndicators
        default:
            return []
    }
}

let mapColNamesToValues = (colNames, patient) => { 
    return colNames.map((col) => {return patient[col]})
}

let isTrue = (count=0, status) => {
    if (status === true) return count + 1
    return count 
}

let isFalse = (count=0, status) => {
    if (status === false) return count + 1
    return count
}

let isNotApplicable = (count=0, status) => {
    if (isNaN(status)) return count + 1
    return count
}


let getResults = (rule, colNames, patients) => {
    let results = patients.map((patient) => {
        return rule(...mapColNamesToValues(colNames, patient))
    })
    return {
        'passed': results.reduce(isTrue, 0),
        'failed': results.reduce(isFalse, 0),
        'na': results.reduce(isNotApplicable, 0)
    }
}

class dmHbA1CDate {
    constructor() {
        this.params = { 
            months: {
                value: 6,
                default: 6 
            }
        }
        this.colNames = ["Report Date", "Date Hb A1C"]
    }
    get desc() { 
        return "Hb A1C in past " + this.params.months.value + " months"; 
    }
	get longDesc() { 
        return "% of patients who have had an Hb A1C measured in the past " + this.params.months.value + " months"; 
    }
    rule(reportDate, measuredDate) {
        try {
            let targetDate = new Date(reportDate).setMonth(reportDate.getMonth() - this.params.months.value)
            return measuredDate >= targetDate;
        } catch (err) {
            console.log(err.message);
            return NaN;
        }
    }
}

class dmVisit {
    constructor() {
        this.params = { 
            months: {
                value: 12,
                default: 12 
            }
        }
        this.colNames = ["Report Date", "Last DM Visit"]
    }
    get desc() { 
        return "DM Visit in past " + this.params.months.value + " months"; 
    }
	get longDesc() { 
        return "% of patients who have had a DM visit in the past " + this.params.months.value + " months"; 
    }
    rule(reportDate, measuredDate) {
        try {
            let targetDate = new Date(reportDate).setMonth(reportDate.getMonth() - this.params.months.value)
            return measuredDate >= targetDate;
        } catch (err) {
            console.log(err.message);
            return NaN;
        }
    }
}

class dmHbA1C {
    constructor() {
        this.params = { 
            hba1c: {
                value: 0.07,
                default: 0.07 
            }
        }
        this.colNames = ["Hb A1C"]
    }
    get desc() { 
        return "Hb A1C less than " + this.params.hba1c.value; 
    }
	get longDesc() { 
        return "% of patients whose most recent Hb A1C is less than " + this.params.hba1c.value; 
    }
    rule(labValue) {
        try {
            return labValue <= this.params.hba1c.value;
        } catch (err) {
            console.log(err.message);
            return NaN;
        }
    }
}

let diabetesIndicators = [
    new dmHbA1CDate(),
    new dmVisit(),
    new dmHbA1C(),
]

module.exports = {
    applyIndicators
}