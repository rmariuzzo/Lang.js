'use strict';

var util = require('util');
var Lang = require('../../src/lang.js');
var messages = require('../fixture/messages');

describe('The lang.fallback() method', function () {

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



    it('should get the fallback expected message when active language does not contain a given language line', function () {
        lang.setLocale('es');
        expect(lang.get("reminders.sent")).toBe('reminders.sent');
        lang.setFallback('en');
        expect(lang.get("reminders.sent")).toBe('Password reminder sent!');
        lang.setLocale('en');
    });


});
