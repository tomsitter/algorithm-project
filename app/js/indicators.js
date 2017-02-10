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
    /* 
    results = {
        'dmMonths': {
            desc,
            longDesc,
            result: {
                'passed': 100,
                'failed': 50,
                'na': 6
            }
        },
        ...
    }
    */
    results = []
    if (condition == 'diabetes') {
        for (let indicator of diabetesIndicators) {
            results.push({
                desc: indicator.desc(),
                longDesc: indicator.longDesc(),
                results: {

                }
            }

            )
        }
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

let isNaN = (count=0, status) => {
    if (isNaN(status)) return count + 1
    return count
}


let getResults = (rule, colNames, patients) => {
    results = patients.map((patient) => {
        return rule(...mapColNamesToValues(colNames, patient))
    })
    return {
        'passed': arr.reduce(isTrue, 0),
        'failed': arr.reduce(isFalse, 0),
        'na': arr.reduce(isNaN, 0),
    }
}

let dmVisit = {
    name: 'dmVisit',
    params: { months: 12 },
    colNames: ["Report Date", "DM Months"],
    desc: () => {return "Diabetic Visit in past " + this.params.months + " months"; },
	longDesc: () => {return "% of patients who have had a diabetic visit (diagnostic code 250) in the past " + this.params.months + " months"; },
    rule: (reportDate, measuredDate) => {
        try {
            if (isNaN(measuredDate)) {
                return false;
            } 

            targetDate = reportDate.getMonth() - this.months
            return (measuredDate >= targetDate);

        } catch (err) {
            console.log(err.message);
            return NaN;
        }
    }
}

let diabetesIndicators = [
    dmVisit
]

module.exports = {
    applyIndicators
}