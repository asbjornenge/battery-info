var assert = require('assert')
var batteryInfo = require('../index')

describe('battery-info', function() {

    it('can read battery info', function(done) {
        batteryInfo('BAT0', function(err, info) {
            assert(err == null)
            assert(typeof info == 'object')
            assert(Object.keys(info).length > 0)
            done()
        })
    })

    it('it returns err if unable to locate battery info', function(done) {
        batteryInfo('NOBATINPATH', function(err, info) {
            assert(err != null)
            done()
        })
    })

})
