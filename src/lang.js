/*!
 *  Lang.js for Laravel localization in JavaScript.
 *
 *  @version 1.0.0
 *  @license MIT
 *  @site    https://github.com/rmariuzzo/Lang.js
 *  @author  Rubens Mariuzzo <rubens@mariuzzo.com>
 */

(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD support.
        define([], factory());
    } else if (typeof exports === 'object') {
        // NodeJS support.
        module.exports = factory();
    } else {
        // Browser global support.
        root.Lang = factory();
    }

}(this, function () {
    'use strict';

    // Default options //

    var defaults = {
        locale: 'en', /** The default locale if not set. */
        fallback: 'en' /** The default fallback locale if not set. */
    };

    var options;
    var locale;
    var fallback;
    var messages;
    
    // Constructor //

    var Lang = function (options) {
        this.locale = options.locale || defaults.locale;
        this.fallback = options.fallback || defaults.fallback;
        this.messages = options.messages;
    };

    // Methods //

    /**
     * Set messages source.
     *
     * @param messages {object} The messages source.
     *
     * @return void
     */
    Lang.prototype.setMessages = function (messages) {
        this.messages = messages;
    };

    /**
     * Get the current locale.
     *
     * @return {string} The current locale.
     */
    Lang.prototype.getLocale = function () {
        return this.locale || options.defaultLocale;
    };

    /**
     * Set the current locale.
     *
     * @param locale {string} The locale to set.
     *
     * @return void
     */
    Lang.prototype.setLocale = function (locale) {
        this.locale = locale;
    };

    /**
     * Get the fallback locale being used.
     *
     * @return string
     */
    Lang.prototype.getFallback = function () {
        return this.fallback;
    };

    /**
     * Set the fallback locale being used.
     *
     * @param fallback {string} fallback locale
     *
     * @return void
     */
    Lang.prototype.setFallback = function (fallback) {
        this.fallback = fallback;
    };

    /**
     * This method act as an alias to get() method.
     *
     * @param key {string} The key of the message.
     * @param locale {string} The locale of the message
     * 
     * @return {boolean} true if the given key is defined on the messages source, otherwise false.
     */
    Lang.prototype.has = function(key, locale) {
        if (typeof key !== 'string' || !this.messages) {
            return false;
        }
        
        return this._getMessage(key, locale) !== null;
    };

    /**
     * Get a translation message.
     *
     * @param key {string} The key of the message.
     * @param replacements {object} The replacements to be done in the message.
     * @param locale {string} The locale to use, if not passed use the default locale.
     *
     * @return {string} The translation message, if not found the given key.
     */
    Lang.prototype.get = function (key, replacements, locale) {
        if (!this.has(key)) {
            return key;
        }

        var message = this._getMessage(key, locale);
        if (message === null) {
            return key;
        }

        if (replacements) {
            message = this._applyReplacements(message, replacements);
        }

        return message;
    };


    /**
     * This method act as an alias to get() method.
     *
     * @param key {string} The key of the message.
     * @param replacements {object} The replacements to be done in the message.
     *
     * @return {string} The translation message, if not found the given key.
     */
    Lang.prototype.trans = function (key, replacements) {
        return this.get(key, replacements);
    };

    /**
     * Gets the plural or singular form of the message specified based on an integer value.
     *
     * @param key {string} The key of the message.
     * @param number {int} The number of elements.
     * @param replacements {object} The replacements to be done in the message.
     * @param locale {string} The locale to use, if not passed use the default locale.
     *
     * @return {string} The translation message according to an integer value.
     */
    Lang.prototype.choice = function (key, number, replacements, locale) {
        // Set default values for parameters replace and locale
        replacements = typeof replacements !== 'undefined' ? replacements : {};

        // The count must be replaced if found in the message
        replacements.count = number;

        // Message to get the plural or singular
        var message = this.get(key, replacements, locale);

        // Check if message is not null or undefined
        if (message === null || message === undefined) {
            return message;
        }

        // Separate the plural from the singular, if any
        var messageParts = message.split('|');

        // Get the explicit rules, If any
        var explicitRules = [];
        var regex = /{\d+}\s(.+)|\[\d+,\d+\]\s(.+)|\[\d+,Inf\]\s(.+)/;

        for (var i = 0; i < messageParts.length; i++) {
            messageParts[i] = messageParts[i].trim();

            if (regex.test(messageParts[i])) {
                var messageSpaceSplit = messageParts[i].split(/\s/);
                explicitRules.push(messageSpaceSplit.shift());
                messageParts[i] = messageSpaceSplit.join(' ');
            }
        }

        // Check if there's only one message
        if (messageParts.length === 1) {
            // Nothing to do here
            return message;
        }

        // Check the explicit rules
        for (var j = 0; j < explicitRules.length; j++) {
            if (this._testInterval(number, explicitRules[j])) {
                return messageParts[j];
            }
        }

        // Standard rules
        if (number === 1) {
            return messageParts[0];
        } else {
            return messageParts[1];
        }
    };


    /**
     * This method act as an alias to choice() method.
     *
     * @param key {string} The key of the message.
     * @param count {int} The number of elements.
     * @param replacements {object} The replacements to be done in the message.
     *
     * @return {string} The translation message according to an integer value.
     */
    Lang.prototype.transChoice = function (key, count, replacements) {
        return this.choice(key, count, replacements);
    };

    /**
     * Parse a message key into components.
     *
     * @param key {string} The message key to parse.
     * @param locale {string} The message locale to parse
     * 
     * @return {object} A key object with source and entries properties.
     */
    Lang.prototype._parseKey = function(key, locale) {
        if (typeof key !== 'string' || typeof locale !== 'string') {
            return null;
        }

        var segments = key.split('.');

        return {
            source: locale + '.' + segments[0],
            sourceFallback: this.getFallback() + '.' + segments[0],
            entries: segments.slice(1)
        };
    };

    /**
     * Returns a translation message. Use `Lang.get()` method instead, this methods assumes the key exists.
     *
     * @param key {string} The key of the message.
     * @param locale {string} The locale of the message
     * 
     * @return {string|null} The translation message for the given key.
     */
    Lang.prototype._getMessage = function(key, locale) {
        var currentLocale = locale || this.getLocale();
        var parsedKey = this._parseKey(key, currentLocale);

        // Ensure message source exists.
        if (
            // check that the section AND the key exist, otherwise fallback
            (this.messages[parsedKey.source] === undefined || (parsedKey.entries[0] && this.messages[parsedKey.source][parsedKey.entries[0]] === undefined))
            && this.messages[parsedKey.sourceFallback] === undefined
        ) {
            return null;
        }

        // Get message text
        var message = this.messages[parsedKey.source] || this.messages[parsedKey.sourceFallback];

        while (parsedKey.entries.length && (message = message[parsedKey.entries.shift()]));

        if (typeof message !== 'string') {
            return null;
        }

        return message;
    };

    /**
     * Apply replacements to a string message containing placeholders.
     *
     * @param message {string} The text message.
     * @param replacements {object} The replacements to be done in the message.
     *
     * @return {string} The string message with replacements applied.
     */
    Lang.prototype._applyReplacements = function (message, replacements) {
        for (var replace in replacements) {
            message = message.split(':' + replace).join(replacements[replace]);
        }
        return message;
    };

    /**
     * Checks if the given `count` is within the interval defined by the {string} `interval`
     *
     * @param  count {int}  The amount of items.
     * @param  interval {string}    The interval to be compared with the count.
     * @return {boolean}    Returns true if count is within interval; false otherwise.
     */
    Lang.prototype._testInterval = function (count, interval) {
        /**
         * From the Symfony\Component\Translation\Interval Docs
         *
         * Tests if a given number belongs to a given math interval.
         * An interval can represent a finite set of numbers: {1,2,3,4}
         * An interval can represent numbers between two numbers: [1, +Inf] ]-1,2[
         * The left delimiter can be [ (inclusive) or ] (exclusive).
         * The right delimiter can be [ (exclusive) or ] (inclusive).
         * Beside numbers, you can use -Inf and +Inf for the infinite.
         */

        return false;
    };

    return Lang;

}));
