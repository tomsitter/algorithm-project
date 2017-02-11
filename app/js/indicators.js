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
            results: getResults(indicator.rule, indicator.colNames, patients)
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

let dmHbA1C = {
    params: { 
        months: {
            value: 12,
            default: 12 
        }
    },
    get desc() { 
        return "Hb A1C in past " + this.params.months.value + " months"; 
    },
	get longDesc() { 
        return "% of patients who have had an Hb A1C measured in the past " + this.params.months.value + " months"; 
    },
    colNames: ["Report Date", "Date Hb A1C"],
    rule: (reportDate, measuredDate) => {
        try {
            if (isNaN(measuredDate)) return false 
            // TODO: How to get params.months.value ??
            let targetDate = reportDate.setMonth(reportDate.getMonth() - this.params.months.value)
            return (measuredDate >= targetDate);
        } catch (err) {
            console.log(err.message);
            return NaN;
        }
    }
}

let diabetesIndicators = [
    dmHbA1C
]

module.exports = {
    applyIndicators
}