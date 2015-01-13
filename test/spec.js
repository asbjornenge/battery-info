var assert = require('assert')
var batteryInfo = require('../index')

describe('battery-info', function() {

    it('can read battery info', function() {
        batteryInfo('BAT0', function(err, info) {
            console.log(info)
        })
    })

})
