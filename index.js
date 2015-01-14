var fs   = require('fs')
var path = require('path')
var walkdir = require('walkdir')
var batteryPath = require('battery-path')

function batteryInfo(battery, callback) {
    if (typeof battery == 'function') { callback = battery; battery = 'BAT0'; }

    var _path  = path.resolve(batteryPath(battery))
    var _info  = {}
    var _done  = false
    var _files = []
    var _errors = null 
    var _files_read = []

    var check_complete = function() {
        if (!_done) return
        if (_files.length == _files_read.length) callback(_errors, _info)
    }

    var emitter = walkdir(_path+'/', function(path, stat) {})
    emitter.on('file', function(file) {
        _files.push(file)
        readAndPopulate(file, _path, _info)
    })
    emitter.on('end', function() {
        _done = true
        check_complete()
    })

    function tryReadFile(fullpath) {
        if (!fs.lstatSync(fullpath).isFile()) return null
        var data;
        try { data = fs.readFileSync(fullpath, 'utf-8') }
        catch(e) { data = null }
        if (typeof data == 'string') {
            var newlines = data.split('\n')
            if (newlines.length == 2) data = newlines[0]
        }
        return data
    }

    function readAndPopulate(file, parent_path, root) {
        var objPath = file.split(parent_path)[1].slice(1)
        var firstObjPath = objPath.split('/')[0]
        if (objPath.indexOf('/') > 0) {
            if (typeof root[firstObjPath] == 'undefined') root[firstObjPath] = {}
            return readAndPopulate(file, parent_path+'/'+firstObjPath, root[firstObjPath])
        }
        root[firstObjPath] = tryReadFile(file) 
        _files_read.push(objPath)
        check_complete()
    }
}

module.exports = batteryInfo;
