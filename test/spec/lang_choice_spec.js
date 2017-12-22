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

    it('should return the expected message with different count', function () {
        lang.setMessages({
            'en.plural': {
                'year': ':count year|:count years'
            }
        });
        expect(lang.choice('plural.year', 1)).toBe('1 year');
        expect(lang.choice('plural.year', 2)).toBe('2 years');
        expect(lang.choice('plural.year', 5)).toBe('5 years');

        lang.setMessages({
            'ru.plural': {
                'year': ':count год|:count года|:count лет'
            }
        });
        lang.setLocale('ru');
        expect(lang.choice('plural.year', 1)).toBe('1 год');
        expect(lang.choice('plural.year', 2)).toBe('2 года');
        expect(lang.choice('plural.year', 5)).toBe('5 лет');
    });

    it('should return the expected message using math intervals', function() {
        lang.setMessages({
            'en.test': {
                'set': '{0} a|{1} :count b|[2,Inf] :count c',
                'range': '[0,10] a| [11,20] b|[21,30] c',
                'infinity': '[-Inf,-1] :count Negative|[0,+Inf] :count Positive',
                'infinityStar': '[*,-1] :count Negative|[0,*] :count Positive',
            }
        });
        expect(lang.choice('test.set', 0)).toBe('a');
        expect(lang.choice('test.set', 1)).toBe('1 b');
        expect(lang.choice('test.set', 2)).toBe('2 c');
        expect(lang.choice('test.range', 0)).toBe('a');
        expect(lang.choice('test.range', 15)).toBe('b');
        expect(lang.choice('test.range', 30)).toBe('c');
        expect(lang.choice('test.infinity', -Infinity)).toBe('-Infinity Negative');
        expect(lang.choice('test.infinity', -5)).toBe('-5 Negative');
        expect(lang.choice('test.infinity', 5)).toBe('5 Positive');
        expect(lang.choice('test.infinity', Infinity)).toBe('Infinity Positive');
        expect(lang.choice('test.infinityStar', -Infinity)).toBe('-Infinity Negative');
        expect(lang.choice('test.infinityStar', -5)).toBe('-5 Negative');
        expect(lang.choice('test.infinityStar', 5)).toBe('5 Positive');
        expect(lang.choice('test.infinityStar', Infinity)).toBe('Infinity Positive');
    });

    it('should return the expected message with replacements', function () {
        expect(lang.choice('validation.accepted', 1)).toBe('The :attribute must be accepted.');
        expect(lang.choice('validation.accepted', 1, {
            'attribute': 'foo'
        })).toBe('The foo must be accepted.');
    });

    it('should return the expected message with changed locale', function() {
        expect(lang.choice('messages.home', 1)).toBe('Home');
        expect(lang.choice('messages.home', 1, {}, 'es')).toBe('Inicio');
    });

    it('should return the expected message using the fallback language', function() {
        lang.setMessages({
            'en.test': {
                'box': ':count box|:count boxes'
            }
        });
        lang.setFallback('en');
        lang.setLocale('pl');
        expect(lang.choice('test.box', 1)).toBe('1 box');
        expect(lang.choice('test.box', 2)).toBe('2 boxes');
        expect(lang.choice('test.box', 10)).toBe('10 boxes');
    });

});
