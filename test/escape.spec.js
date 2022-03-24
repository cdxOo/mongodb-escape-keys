var { expect } = require('chai');
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
});
