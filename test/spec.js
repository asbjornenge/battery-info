var assert = require('assert')
var batteryInfo = require('../index')

describe('battery-info', function() {

    it('can read battery info', function(done) {
        batteryInfo('BAT0', function(err, info) {
            assert(typeof info == 'object')
            assert(Object.keys(info).length > 0)
            console.log(info)
            done()
        })
    })

})
