'use strict';
var { expect } = require('chai');
var { EJSON } = require('bson');
var { ObjectId } = require('mongodb');

var mongoKeys = require('../src');

describe('basics', () => {
    var pairs = [
        [
            { $set: { foo: 42 }},
            { '/$set': { '/foo': 42 }}
        ],
        [
            { $set: { 'foo.bar': 42, }},
            { '/$set': { '/foo/bar': 42 }}
        ],
        [
            { $set: { 'foo.$[item].bar': 42, }},
            { '/$set': { '/foo/$[item]/bar': 42 }}
        ],
        [
            { '$foo.$bar': { '$baz.$quux': '$a.b.$c' }},
            { '/$foo/$bar': { '/$baz/$quux': '$a.b.$c' }}
        ]
    ];

    it('escapes keys', () => {
        for (var it of pairs) {
            expect(mongoKeys.escape(it[0])).to.deep.eql(it[1]);
        }
    });

    it('unsecapes keys', () => {
        for (var it of pairs) {
            expect(mongoKeys.unescape(it[1])).to.deep.eql(it[0]);
        }
    });

    it('escape handles ObjectID well', () => {
        var payload = {
            'a.fooId': ObjectId('000000000000000000000000')
        };
        var escaped = mongoKeys.escape(payload);

        var ejson = JSON.parse(EJSON.stringify(escaped))
        expect(ejson).to.deep.eql({
            '/a/fooId': { $oid: '000000000000000000000000' }
        });
    })
    
    it('unescape handles ObjectID well', () => {
        var payload = {
            '/a/fooId': ObjectId('000000000000000000000000')
        };
        var unescaped = mongoKeys.unescape(payload);

        var ejson = JSON.parse(EJSON.stringify(unescaped))
        expect(ejson).to.deep.eql({
            'a.fooId': { $oid: '000000000000000000000000' }
        });
    })
});
