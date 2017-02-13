const chai = require('chai')
const expect = chai.expect
const rewire = require('rewire')
const indicators = rewire('../app/js/indicators')

describe("Indicators", () => {
    it('dmHbA1CDate should return true when measuredDate is within 6 months of report date', (done) => {
        let dmHbA1CDate = indicators.__get__('dmHbA1CDate')

        let indicator = new dmHbA1CDate()
        let reportDate = new Date(2017, 0, 1)
        let twoMonthsAgo = new Date(2016, 10, 1) // Nov 1st
        let sixMonthsAgo = new Date(2016, 6, 1) // July 1st
        let eightMonthsAgo = new Date(2016, 4, 1) // May 1st

        var actual = indicator.rule(reportDate=reportDate, measuredDate=twoMonthsAgo)
        expect(actual).to.be.true

        var actual = indicator.rule(reportDate=reportDate, measuredDate=sixMonthsAgo)
        expect(actual).to.be.true

        var actual = indicator.rule(reportDate=reportDate, measuredDate=eightMonthsAgo)
        expect(actual).to.be.false

        var actual = indicator.rule(reportDate=reportDate, measuredDate=undefined)
        expect(actual).to.be.false

        done()
    })

    it('dmHbA1C should return true when A1C is less then or equal to 0.07', (done) => {
        let dmHbA1C = indicators.__get__('dmHbA1C')

        let indicator = new dmHbA1C()
        let over7 = 0.08
        let at7 = 0.07
        let under7 = 0.06

        var actual = indicator.rule(a1c=over7)
        expect(actual).to.be.false

        var actual = indicator.rule(a1c=at7)
        expect(actual).to.be.true

        var actual = indicator.rule(a1c=under7)
        expect(actual).to.be.true

        done();
    })

    it('dmVisit should return true when last DM Visit is within 12 months of report date', (done) => {
        let dmVisit = indicators.__get__('dmVisit')

        let indicator = new dmVisit()
        let reportDate = new Date(2017, 0, 1)
        let twoMonthsAgo = new Date(2016, 10, 1) // Nov 1st
        let sixMonthsAgo = new Date(2016, 6, 1) // July 1st
        let twelveMonthsAgo = new Date(2016, 0, 1) // Jan 1st, 2016
        let fourteenMonthsAgo = new Date(2015, 10, 1) // Nov 1st, 2015

        var actual = indicator.rule(reportDate=reportDate, visitDate=twoMonthsAgo)
        expect(actual).to.be.true

        var actual = indicator.rule(reportDate=reportDate, visitDate=sixMonthsAgo)
        expect(actual).to.be.true

        var actual = indicator.rule(reportDate=reportDate, visitDate=twelveMonthsAgo)
        expect(actual).to.be.true

        var actual = indicator.rule(reportDate=reportDate, visitDate=fourteenMonthsAgo)
        expect(actual).to.be.false

        var actual = indicator.rule(reportDate=reportDate, visitDate=undefined)
        expect(actual).to.be.false

        done();
    })
})