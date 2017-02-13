const chai = require('chai')
const expect = chai.expect
const {Parser} = require('../app/js/parsers')

chai.Assertion.addChainableMethod('equalDate', function(date) {
  var expectedDate  = date.toDateString(),
      actualDate    = this._obj.toDateString();

  return this.assert(
    expectedDate === actualDate,
    'expected ' + actualDate + ' to equal ' + expectedDate,
    'expected ' + actualDate + ' to not equal ' + expectedDate
  )
});

describe('Parser', function() {
    it('Should parse a numeric string to an integer', (done) => {
        let numString = '5'
        let actual = Parser.parseNum(numString)
        let expected = 5
        expect(actual).to.equal(expected)
        done()
    });
    it('Should parse a date string to a Date object', (done) => {
        const expected = new Date(2016, 9, 5)
        
        let dateString = 'Oct 5, 2016'
        let actual = Parser.parseDate(dateString)
        expect(actual).to.equalDate(expected)
        done()
    });
    it('Should parse a date string of format dd/mm/yyyy to a Date object', (done) => {
        const expected = new Date(2016, 9, 5)
        
        let dateString = '05/10/2016'
        let actual = Parser.parseDdMmYyyyDate(dateString)
        expect(actual).to.equalDate(expected)
        done()
    });
    it('Should correctly parse a decimal string Hb A1C to a decimal value', (done) => {
        const expected = 0.076

        let a1c = '0.076'
        let actual = Parser.parseHbA1c(a1c)
        expect(actual).to.equal(expected)
        done()
    });
    it('Should correctly parse a percent string Hb A1C to a decimal value', (done) => {
        const expected = 0.076

        let a1c = '7.6'
        let actual = Parser.parseHbA1c(a1c)
        expect(actual).to.equal(expected)
        done()
    });

})