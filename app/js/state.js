const {normalizeData} = require('./normalize')
const {applyIndicators} = require('./indicators')

class State {
    constructor() {
        // emr and condition are dropdowns set in the require
        // emr is used for normalization and condition is used for calculating indicators
        this.emr = 'pss'
        this.condition = 'diabetes'
    }
    set data(data) {
        // Setting data will automatically normalize it from EMR specific data to standardardized data
        delete this._results
        this._data = data
        this.normalizedData = normalizeData(this.emr, this.condition, data)
    }
    get results() {
        // Indicator resulted are computed from the normalized data when asked for. 
        // Results are cached in _results until new data is assigned
        return typeof this._results !== 'undefined' ? 
            this._results :
            this._results = applyIndicators(this.condition, this.normalizedData);
    }
}

module.exports = {
    State
}