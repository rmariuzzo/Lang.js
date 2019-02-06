var util = require('util');
var Lang = require('../../src/lang.js');
var messages = require('../fixture/messages');

describe('The lang.get() method', function () {
    'use strict';

    var lang;

    beforeEach(function () {
        lang = new Lang({
            messages: messages
        });
    });

    it('should exists', function () {
        expect(lang.get).toBeDefined();
    });

    it('should be a function', function () {
        expect(typeof lang.get).toBe('function');
    });

    it('should return the passed key when not found', function () {
        expect(lang.get('foo.bar')).toBe('foo.bar');
        expect(lang.get(null)).toBe(null);
    });

    it('should return the expected message', function () {
        expect(lang.get('messages.home')).toBe('Home');
    });

    it('should return the expected nested message', function () {
        expect(lang.get('messages.family.father')).toBe('John');
        expect(lang.get('messages.family.children.son')).toBe('Jimmy');
    });

    it('should return the passed key when nested message does not point to a message', function () {
        expect(lang.get('messages.family.children')).toBe('messages.family.children');
        expect(lang.get('a.b.c.d.f.g.h.i.j.k')).toBe('a.b.c.d.f.g.h.i.j.k');
    });

    it('should return the expected message with replacements', function () {
        expect(lang.get('validation.accepted')).toBe('The :attribute must be accepted.');
        expect(lang.get('validation.accepted', {
            'attribute': 'foo'
        })).toBe('The foo must be accepted.');
    });

    it('should return the expected message with changed locale', function() {
        expect(lang.get('messages.home')).toBe('Home');
        expect(lang.get('messages.home', {}, 'es')).toBe('Inicio');
    });

    it('should capitalize the replacement key', function () {
        expect(lang.get('validation.accepted_first_cap', {
            'attribute': 'foo'
        })).toBe('The Foo must be accepted.');
        expect(lang.get('validation.accepted_all_caps', {
            'attribute': 'foo'
        })).toBe('The FOO must be accepted.');
    });

    it('should return the expected message from a nested directory', function() {
        expect(lang.get('forum/thread.viewAllThreads')).toBe('View all threads');
    });

    it('should return the expected message if the key has a dot', function() {
        expect(lang.get('messages.dot.in.key')).toBe('Dot In Key');
    });

    it('should prioritize the dot in key', function() {
        expect(lang.get('messages.with_parent.dot.in.key')).toBe('Dot In Key With a Parent Key');
    });

    it('should return the expected message if the key is nested and has a dot', function() {
        expect(lang.get('messages.dotInKey.dot.in.key')).toBe('Dot In Key Nested Simple');
        expect(lang.get('messages.dot.in.key2.nested.dot.in.key2.nested')).toBe('Dot In Key Nested Tricky');
    });

    it('should return an empty string', function() {
        expect(lang.get('messages.empty')).toBe('');
    });

    it('should return the expected message when keys has equal prefix', function() {
        expect(lang.get('unique.samePrefixKeys', {
            items: 5,
            itemsPapayas: 3,
            itemsMangoes: 2
        })).toBe('Your order contains 5 items with 3 papayas and 2 mangoes');
    });
});
