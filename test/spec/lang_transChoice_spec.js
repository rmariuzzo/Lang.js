var util = require('util');
var Lang = require('../../src/lang.js');
var messages = require('../fixture/messages');

describe('The lang.transChoice() method', function () {
    'use strict';

    var lang;

    beforeEach(function () {
        lang = new Lang({
            messages: messages
        });
    });

    it('should exists', function () {
        expect(lang.transChoice).toBeDefined();
    });

    it('should be a function', function () {
        expect(typeof lang.transChoice).toBe('function');
    });

    it('should return the passed key when not found', function () {
        expect(lang.transChoice('foo.bar', 1)).toBe(lang.choice('foo.bar', 1));
        expect(lang.transChoice(null, 1)).toBe(lang.choice(null, 1));
    });

    it('should return the expected message', function () {
        expect(lang.transChoice('messages.plural', 1)).toBe(lang.choice('messages.plural', 1));
        expect(lang.transChoice('messages.plural', 10)).toBe(lang.choice('messages.plural', 10));
    });

    it('should return the expected message with replacements', function () {
        expect(lang.transChoice('validation.accepted', 1)).toBe(lang.choice('validation.accepted', 1));
        expect(lang.transChoice('validation.accepted', 1, {
            'attribute': 'foo'
        })).toBe(lang.choice('validation.accepted', 1, {
            'attribute': 'foo'
        }));
    });

});
