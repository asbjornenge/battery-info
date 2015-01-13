var fs   = require('fs')
var path = require('path')
var batteryPath = require('battery-path')

function batteryRemainingPercent(battery, callback) {
  if (typeof battery == 'function') { callback = battery; battery = 'BAT0'; }

    function readBatteryInfo(battery, property) {
        return fs.readFileSync(path.resolve(batteryPath(battery), property))
    }

    console.log(readBatteryInfo(battery,'energy_now'))
    console.log(readBatteryInfo(battery,'energy_full'))

/*
  function getRemaining(location, callback) {
    firstLine(location, function(error, remaining) {
      if (error) {
        callback(error);
        return;
      }

      remaining = parseFloat(remaining.toString());

      // convert muWatts to Watts
      remaining *= Math.pow(10, -6);

      callback(null, remaining);
    });
  }

  var bstr = path.resolve(batteryPath(battery), 'energy_now');
  getRemaining(bstr, function(error, remaining) {
    if (error) {

      // try alternate location
      bstr = path.resolve(batteryPath(battery), 'charge_now');
      getRemaining(bstr, callback);
      return;
    }

    callback(null, remaining);
*/
  });
}

module.exports = batteryRemaining;
