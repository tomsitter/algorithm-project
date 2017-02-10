const {normalizeData} = require('./normalize')
const {applyIndicators} = require('./indicators')

class State {
    constructor() {
        this.emr = 'pss'
        this.condition = 'diabetes'
    }
    set data(data) {
        delete this._results
        this._data = data
        this.normalizedData = normalizeData(this.emr, this.condition, data)
    }
    get results() {
        return typeof this._results !== 'undefined' ? 
            this._results :
            this._results = applyIndicators(this.condition, this.normalizedData);
    }
}

module.exports = {
    State
}