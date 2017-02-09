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

let dmVisit = {
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

let diabetesIndicatorSet = [
    dmVisit
]

module.exports = {
    // individual indicators
    dmVisit,

    // sets of indicators
    diabetesIndicatorSet
}