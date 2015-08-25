var util = require('util');
var Lang = require('../../src/lang.js');
var messages = require('../fixture/messages');

describe('The lang.fallback() method', function () {
    'use strict';

    var lang;

    beforeEach(function () {
        lang = new Lang({
            messages: messages
        });
    });

    it('should exists', function () {
        expect(lang.setFallback).toBeDefined();
        expect(lang.getFallback).toBeDefined();

    });

    it('should be a function', function () {
        expect(typeof lang.setFallback).toBe('function');
        expect(typeof lang.getFallback).toBe('function');

    });

    it('should set default fallback', function () {
        lang.setFallback('es');
        expect(lang.getFallback()).toBe('es');
    });

    it('should get the message in the setted fallback locale if the message does not exists in the defined locale', function () {
        lang.setLocale('en');
        lang.setFallback('en');
        var enMessage = lang.get('fallback.test');
        lang.setLocale('es');
        expect(lang.get('fallback.test')).toBe(enMessage);
    });


});
