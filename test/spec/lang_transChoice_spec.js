'use strict';

var util = require('util');
var Lang = require('../../src/lang.js');
var messages = require('../fixture/messages');

Lang.setMessages(messages);

describe('The Lang.transChoice() method', function () {

    it('should exists', function () {
        expect(Lang.transChoice).toBeDefined();
    });

    it('should be a function', function () {
        expect(typeof Lang.transChoice).toBe('function');
    });

    it('should return the passed key when not found', function () {
        expect(Lang.transChoice('foo.bar', 1)).toBe(Lang.choice('foo.bar', 1));
        expect(Lang.transChoice(null, 1)).toBe(Lang.choice(null, 1));
    });

    it('should return the expected message', function () {
        expect(Lang.transChoice('messages.plural', 1)).toBe(Lang.choice('messages.plural', 1));
        expect(Lang.transChoice('messages.plural', 10)).toBe(Lang.choice('messages.plural', 10));
    });

    it('should return the expected message with replacements', function () {
        expect(Lang.transChoice('validation.accepted', 1)).toBe(Lang.choice('validation.accepted', 1));
        expect(Lang.transChoice('validation.accepted', 1, {
            'attribute': 'foo'
        })).toBe(Lang.choice('validation.accepted', 1, {
            'attribute': 'foo'
        }));
    });

});
