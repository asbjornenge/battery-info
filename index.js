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
        //console.log('file', file)
        _files.push(file)
        readAndPopulate(file, _path, _info)
    })
    emitter.on('end', function() {
        console.log('im done')
        _done = true
        check_complete()
    })

    function readFileMaybe(fullpath) {
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
        console.log('first', firstObjPath)
        if (objPath.indexOf('/') > 0) {
            if (typeof root[firstObjPath] == 'undefined') root[firstObjPath] = {}
            return readAndPopulate(file, parent_path+'/'+firstObjPath, root[firstObjPath])
        }
        root[firstObjPath] = readFileMaybe(file) 
        _files_read.push(objPath)
        check_complete()
    }

    function buildJSON(keys, obj) {
        obj = obj || {}
        var parent = keys.shift()
        if (keys.length > 0) { 
            if (typeof obj[parent] != 'object') obj[parent] = {}; 
            return buildJSON(keys, obj[parent]) 
        }
        else obj[parent] = parent
        return obj
    }

    function readFiles(obj, parent_path) {
        Object.keys(obj).forEach(function(key) {
            if (typeof obj[key] == 'object') return readFiles(obj[key], parent_path+'/'+key)
            var fullpath = parent_path+'/'+key
            if (!fs.lstatSync(fullpath).isFile()) return obj[key] = null
            try { obj[key] = fs.readFileSync(fullpath, 'utf-8') }
            catch(e) { obj[key] = null }
            if (typeof obj[key] == 'string') {
                var newlines = obj[key].split('\n')
                if (newlines.length == 2) obj[key] = newlines[0]
            }
        })
    }

    var paths = walkdir.sync(_path+'/').map(function(fullpath) {
        return fullpath.split(_path)[1].split('/').slice(1)
    }).reduce(function(coll, curr, index, arr) {
        buildJSON(curr, coll)
        return coll
    }, {})

    readFiles(paths, _path)
    return paths 
}

module.exports = batteryInfo;
