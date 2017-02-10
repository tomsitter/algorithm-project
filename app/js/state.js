const {extendObservable, computed} = require('mobx')

class State {
    constructor() {
        extendObservable(this, {
            emr: 'pss',
            condition: 'diabetes',
            patients: {},
            get results() {
                return this.patients.map(function(a) {return a["DM Months"];});
            }
        })
    }
}

module.exports = {
    State
}