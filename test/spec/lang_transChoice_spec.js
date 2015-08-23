'use strict';

var util = require('util');
var Lang = require('../../src/lang.js');
var messages = require('../fixture/messages');

Lang.setMessages(messages);

describe('The Lang.transChoice() method', function() {

    it('should exists', function() {
        expect(Lang.transChoice).toBeDefined();
    });

});
