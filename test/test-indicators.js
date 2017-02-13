const chai = require('chai')
const expect = chai.expect
const rewire = require('rewire')
const indicators = rewire('../app/js/indicators')

describe("Indicators", () => {
    it('dmHbA1CDate should return true when given a date is within 6 months', (done) => {
        let dmHbA1CDate = indicators.__get__('dmHbA1CDate')

        let indicator = new dmHbA1CDate()
        let reportDate = new Date(2017, 1, 1)
        let twoMonthsAgo = new Date(2016, 9, 1) // Oct 1st
        let sixMonthsAgo = new Date(2016, 7, 1) // Aug 1st
        let eightMonthsAgo = new Date(2016, 5, 1) // Jun 1st

        var actual = indicator.rule(reportDate=reportDate, measuredDate=twoMonthsAgo)
        expect(actual).to.be.true

        var actual = indicator.rule(reportDate=reportDate, measuredDate=sixMonthsAgo)
        expect(actual).to.be.true

        var actual = indicator.rule(reportDate=reportDate, measuredDate=eightMonthsAgo)
        expect(actual).to.be.false

        done();
    })
})