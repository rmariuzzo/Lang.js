var util = require('util');
var Lang = require('../../src/lang.js');
var messages = require('../fixture/messages');

describe('The lang\'s fallback locale feature', function() {
    'use strict';

    var lang;

    beforeEach(function() {
        lang = new Lang({messages: messages});
    });

    it('should have setFallback and getFallback methods', function() {
        expect(lang.setFallback).toBeDefined();
        expect(lang.getFallback).toBeDefined();
        expect(typeof lang.setFallback).toBe('function');
        expect(typeof lang.getFallback).toBe('function');
    });

    it('should set default fallback', function() {
        lang.setFallback('es');
        expect(lang.getFallback()).toBe('es');
    });

    it('should get the message using the fallback locale when the message does not exist in the defined locale', function() {
        var messages = {
            'en.greetings': {
                'hi': 'Hi',
                'hello': 'Hello'
            },
            'it.greetings': {
                'hi': 'Salve'
            }
        };
        lang = new Lang({
            messages: messages
        });
        lang.setLocale('it');
        expect(lang.get('greetings.hello')).toBe('greetings.hello');
        lang.setFallback('en');
        expect(lang.get('greetings.hello')).toBe(messages['en.greetings'].hello);
    });

    it('should not throw an error when the message is not defined and a fallback is set', function() {
        var messages = {
            'en.greetings': {
                'hi': 'Hi',
                'hello': 'Hello'
            }
        };
        lang = new Lang({
            messages: messages
        });
        lang.setLocale('it');
        lang.setFallback('en');
        expect(function() {
            lang.get('greetings.hello');
        }).not.toThrow();
    });
});
