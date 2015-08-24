var util = require('util');
var Lang = require('../../src/lang.js');
var messages = require('../fixture/messages');

describe('The lang.choice() method', function () {
    'use strict';

    var lang;

    beforeEach(function () {
        lang = new Lang({
            messages: messages
        });
    });


    it('should exists', function () {
        expect(lang.choice).toBeDefined();
    });

    it('should be a function', function () {
        expect(typeof lang.choice).toBe('function');
    });

    it('should return the passed key when not found', function () {
        expect(lang.choice('foo.bar', 1)).toBe('foo.bar');
        expect(lang.choice(null, 1)).toBe(null);
    });

    it('should return the expected message', function () {
        expect(lang.choice('messages.plural', 1)).toBe('one apple');
        expect(lang.choice('messages.plural', 10)).toBe('a million apples');
    });

    it('should return the expected message with replacements', function () {
        expect(lang.choice('validation.accepted', 1)).toBe('The :attribute must be accepted.');
        expect(lang.choice('validation.accepted', 1, {
            'attribute': 'foo'
        })).toBe('The foo must be accepted.');
    });

});
