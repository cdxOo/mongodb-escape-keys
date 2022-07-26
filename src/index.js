'use strict';
var traverse = require('@cdxoo/traverse');
var convertPathToPointer = require('@cdxoo/objectpath-to-jsonpointer');
var convertPointerToPath = require('@cdxoo/jsonpointer-to-objectpath');

var escapeTokens = (tokens) => {
    var out = [];
    for (var t of tokens) {
        out.push(convertPathToPointer(t));
    }
    return out;
}

var unescapeTokens = (tokens) => {
    var out = [];
    for (var t of tokens) {
        out.push(convertPointerToPath(t));
    }
    return out;
}

var splitlast = (items) => {
    var head = items.slice(0, -1);
    var [ last ] = items.slice(-1);

    return [ head, last ]
}

var applyTo = ({ target: out, path, value, isLeaf }) => {
    if (path.length < 1) {
        return; // root node
    }

    var [ head, key ] = splitlast(path);

    var target = out;
    for (var token of head) {
        target = target[token];
    }
    
    if (isLeaf) {
        target[key] = value;
    }
    else {
        target[key] = Array.isArray(value) ? [] : {};
    }
}

var escapeKeys = (payload) => {
    var out = {};
    traverse(payload, (context) => {
        var { isLeaf, path, value } = context;
        
        applyTo({
            target: out,
            path: escapeTokens(path),
            value,
            isLeaf
        });

    }, {});

    return out;
}

var unescapeKeys = (payload) => {
    var out = {};
    traverse(payload, (context) => {
        var { isLeaf, path, value } = context;
        
        applyTo({
            target: out,
            path: unescapeTokens(path),
            value,
            isLeaf
        });

    }, {});
    return out;
}

module.exports = {
    escape: escapeKeys,
    unescape: unescapeKeys,
}
