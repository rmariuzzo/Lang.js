'use strict';

var util = require('util');
var Lang = require('../../src/lang.js');
var messages = require('../fixture/messages');

describe('The lang.has() method', function () {

    var lang;

    beforeEach(function () {
        lang = new Lang({
            messages: messages
        });
    });

    it('should exists', function () {
        expect(lang.has).toBeDefined();
    });

    it('should be a function', function () {
        expect(typeof lang.has).toBe('function');
    });

    it('should return false when the given key is no defined', function () {
        expect(lang.has('foo.bar')).toBe(false);
        expect(lang.has(null)).toBe(false);
    });

    it('should return true when the given key is defined', function () {
        expect(lang.has('messages.home')).toBe(true);
        expect(lang.has('validation.accepted')).toBe(true);
    });

});
