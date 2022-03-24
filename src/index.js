'use strict';
var mapObject = require('map-obj');
var convertPathToPointer = require('@cdxoo/objectpath-to-jsonpointer');
var convertPointerToPath = require('@cdxoo/jsonpointer-to-objectpath');

var escapeKeys = (payload) => {
    var escaped = mapObject(payload, (key, value) => {
        var escapedKey = convertPathToPointer(key);
        return [ escapedKey, value ]
    }, { deep: true });

    return escaped;
}

var unescapeKeys = (payload) => {
    var unescaped = mapObject(payload, (key, value) => {
        var unescapedKey = convertPointerToPath(key);
        return [ unescapedKey, value ]
    }, { deep: true });

    return unescaped;
}

module.exports = {
    escape: escapeKeys,
    unescape: unescapeKeys,
}
