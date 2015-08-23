'use strict';

var util = require('util');
var Lang = require('../../src/lang.js');
var messages = require('../fixture/messages');

Lang.setMessages(messages);

describe('The Lang\'s fallback methods', function() {

    it('should exists', function() {
        expect(Lang.setFallback).toBeDefined();
        expect(Lang.getFallback).toBeDefined();

    });

    it('should be a function', function() {
        expect(typeof Lang.setFallback).toBe('function');
        expect(typeof Lang.getFallback).toBe('function');

    });
    
    it('should return default fallback',function() {
       expect(Lang.getFallback()).toBe('en'); 
    });
    it('should set default fallback',function() {
        Lang.setFallback('fr'); 
        expect(Lang.getFallback()).toBe('fr');
    });
    
    it('should get the fallback expected message when active language does not contain a given language line',function() {
       Lang.setLocale('es');
       Lang.setFallback('en');
       expect(Lang.get('messages.home')).toBe('Inicio');
       expect(Lang.get("reminders.sent")).toBe('Password reminder sent!');
       Lang.setLocale('en');
    });


});
