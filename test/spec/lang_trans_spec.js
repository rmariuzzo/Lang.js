'use strict';

var util = require('util');
var Lang = require('../../src/lang.js');
var messages = require('../fixture/messages');

Lang.setMessages(messages);

describe('The Lang.trans() method', function() {

    it('should exists', function() {
        expect(Lang.trans).toBeDefined();
    });

    it('should be a function', function() {
        expect(typeof Lang.trans).toBe('function');
    });

    it('should return the passed key when not found', function() {
        expect(Lang.trans('foo.bar')).toBe('foo.bar');
        expect(Lang.trans(null)).toBe(null);
    });

    it('should return the expected message', function() {
        expect(Lang.trans('messages.home')).toBe('Home');
    });

    it('should return the expected nested message', function() {
        expect(Lang.trans('messages.family.father')).toBe('John');
        expect(Lang.trans('messages.family.children.son')).toBe('Jimmy');
    });

    it('should return the passed key when nested message does not point to a message', function() {
        expect(Lang.trans('messages.family.children')).toBe('messages.family.children');
        expect(Lang.trans('a.b.c.d.f.g.h.i.j.k')).toBe('a.b.c.d.f.g.h.i.j.k');
    });

    it('should return the expected message with replacements', function() {
        expect(Lang.trans('validation.accepted')).toBe('The :attribute must be accepted.');
        expect(Lang.trans('validation.accepted', {
            'attribute': 'foo'
        })).toBe('The foo must be accepted.');
    });

});
