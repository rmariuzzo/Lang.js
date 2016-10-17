var rewire = require('rewire');
var util = require('util');
var Lang = require('../../src/lang');
var messages = require('../fixture/messages');

describe('The Lang\'s locale methods', function() {
    'use strict';

    var lang;

    beforeEach(function() {
        lang = new Lang({messages: messages});
    });

    it('should have a getLocale', function() {
        expect(lang.getLocale).toBeDefined();
        expect(typeof lang.getLocale).toBe('function');
    });

    it('should have a setLocale', function() {
        expect(lang.setLocale).toBeDefined();
        expect(typeof lang.setLocale).toBe('function');
    });

    it('should return the default locale', function() {
        expect(lang.getLocale()).toBe('en');
    });

    it('should return the locale specified', function() {
        lang.setLocale('es');
        expect(lang.getLocale()).toBe('es');
    });

    it('should affect messages', function() {
        lang.setLocale('es');
        var es = lang.get('messages.home');
        lang.setLocale('en');
        var en = lang.get('messages.home');
    });

    it('should return the locale defined in HTML\'s lang attribute', function() {
        var document = {
            documentElement: {
                lang: 'fr'
            }
        };
        var Lang = rewire('../../src/lang');
        var revert = Lang.__set__('document', document);
        lang = new Lang({messages: messages});
        expect(lang.getLocale()).toBe(document.documentElement.lang);
        revert();
    });

});
