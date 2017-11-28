var util = require('util');
var Lang = require('../../src/lang.js');
var messages = require('../fixture/messages');

describe('The lang.trans() method', function () {
    'use strict';

    var lang;

    beforeEach(function () {
        lang = new Lang({
            messages: messages
        });
    });

    it('should exists', function () {
        expect(lang.trans).toBeDefined();
    });

    it('should be a function', function () {
        expect(typeof lang.trans).toBe('function');
    });

    it('should return the passed key when not found', function () {
        expect(lang.trans('foo.bar')).toBe('foo.bar');
        expect(lang.trans(null)).toBe(null);
    });

    it('should return the expected message', function () {
        expect(lang.trans('messages.home')).toBe('Home');
    });

    it('should return the expected nested message', function () {
        expect(lang.trans('messages.family.father')).toBe('John');
        expect(lang.trans('messages.family.children.son')).toBe('Jimmy');
    });

    it('should return the expected message inside nested directory', function () {
        expect(lang.trans('forum/thread.viewAllThreads')).toBe('View all threads');
    });

    it('should return the expected message inside a deeply nested directory', function () {
        expect(lang.trans('dir1/dir2/child.deeplynestedmessage')).toBe('Message from file 2 directories down');
    });

    it('should return the passed key when nested message does not point to a message', function () {
        expect(lang.trans('messages.family.children')).toBe('messages.family.children');
        expect(lang.trans('a.b.c.d.f.g.h.i.j.k')).toBe('a.b.c.d.f.g.h.i.j.k');
    });

    it('should return the expected message with replacements', function () {
        expect(lang.trans('validation.accepted')).toBe('The :attribute must be accepted.');
        expect(lang.trans('validation.accepted', {
            'attribute': 'foo'
        })).toBe('The foo must be accepted.');
    });
});
