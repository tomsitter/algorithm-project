// Utility functions for parsing data from various EMRs

function parseDate(emr, date) {
    if (emr == 'PSS') {
        return new Date(date);
    }
}

module.exports = {
    'parseDate': parseDate
}