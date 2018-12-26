/*!
 *  Lang.js for Laravel localization in JavaScript.
 *
 *  @version 1.1.12
 *  @license MIT https://github.com/rmariuzzo/Lang.js/blob/master/LICENSE
 *  @site    https://github.com/rmariuzzo/Lang.js
 *  @author  Rubens Mariuzzo <rubens@mariuzzo.com>
 */

(function(root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD support.
        define([], factory);
    } else if (typeof exports === 'object') {
        // NodeJS support.
        module.exports = factory();
    } else {
        // Browser global support.
        root.Lang = factory();
    }

}(this, function() {
    'use strict';

    function inferLocale() {
        if (typeof document !== 'undefined' && document.documentElement) {
            return document.documentElement.lang;
        }
    };

    function convertNumber(str) {
        if (str === '-Inf') {
            return -Infinity;
        } else if (str === '+Inf' || str === 'Inf' || str === '*') {
            return Infinity;
        }
        return parseInt(str, 10);
    }

    // Derived from: https://github.com/symfony/translation/blob/460390765eb7bb9338a4a323b8a4e815a47541ba/Interval.php
    var intervalRegexp = /^({\s*(\-?\d+(\.\d+)?[\s*,\s*\-?\d+(\.\d+)?]*)\s*})|([\[\]])\s*(-Inf|\*|\-?\d+(\.\d+)?)\s*,\s*(\+?Inf|\*|\-?\d+(\.\d+)?)\s*([\[\]])$/;
    var anyIntervalRegexp = /({\s*(\-?\d+(\.\d+)?[\s*,\s*\-?\d+(\.\d+)?]*)\s*})|([\[\]])\s*(-Inf|\*|\-?\d+(\.\d+)?)\s*,\s*(\+?Inf|\*|\-?\d+(\.\d+)?)\s*([\[\]])/;

    // Default options //

    var defaults = {
        locale: 'en'/** The default locale if not set. */
    };

    // Constructor //

    var Lang = function(options) {
        options = options || {};
        this.locale = options.locale || inferLocale() || defaults.locale;
        this.fallback = options.fallback;
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
    Lang.prototype.setMessages = function(messages) {
        this.messages = messages;
    };

    /**
     * Get the current locale.
     *
     * @return {string} The current locale.
     */
    Lang.prototype.getLocale = function() {
        return this.locale || this.fallback;
    };

    /**
     * Set the current locale.
     *
     * @param locale {string} The locale to set.
     *
     * @return void
     */
    Lang.prototype.setLocale = function(locale) {
        this.locale = locale;
    };

    /**
     * Get the fallback locale being used.
     *
     * @return void
     */
    Lang.prototype.getFallback = function() {
        return this.fallback;
    };

    /**
     * Set the fallback locale being used.
     *
     * @param fallback {string} The fallback locale.
     *
     * @return void
     */
    Lang.prototype.setFallback = function(fallback) {
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
    Lang.prototype.get = function(key, replacements, locale) {
        if (!this.has(key, locale)) {
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
    Lang.prototype.trans = function(key, replacements) {
        return this.get(key, replacements);
    };

    /**
     * Gets the plural or singular form of the message specified based on an integer value.
     *
     * @param key {string} The key of the message.
     * @param count {number} The number of elements.
     * @param replacements {object} The replacements to be done in the message.
     * @param locale {string} The locale to use, if not passed use the default locale.
     *
     * @return {string} The translation message according to an integer value.
     */
    Lang.prototype.choice = function(key, number, replacements, locale) {
        // Set default values for parameters replace and locale
        replacements = typeof replacements !== 'undefined'
            ? replacements
            : {};

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

        for (var i = 0; i < messageParts.length; i++) {
            messageParts[i] = messageParts[i].trim();

            if (anyIntervalRegexp.test(messageParts[i])) {
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

        locale = locale || this._getLocale(key);
        var pluralForm = this._getPluralForm(number, locale);

        return messageParts[pluralForm];
    };

    /**
     * This method act as an alias to choice() method.
     *
     * @param key {string} The key of the message.
     * @param count {number} The number of elements.
     * @param replacements {object} The replacements to be done in the message.
     *
     * @return {string} The translation message according to an integer value.
     */
    Lang.prototype.transChoice = function(key, count, replacements) {
        return this.choice(key, count, replacements);
    };

    /**
     * Parse a message key into components.
     *
     * @param key {string} The message key to parse.
     * @param key {string} The message locale to parse
     * @return {object} A key object with source and entries properties.
     */
    Lang.prototype._parseKey = function(key, locale) {
        if (typeof key !== 'string' || typeof locale !== 'string') {
            return null;
        }

        var segments = key.split('.');
        var source = segments[0].replace(/\//g, '.');

        return {
            source: locale + '.' + source,
            sourceFallback: this.getFallback() + '.' + source,
            entries: segments.slice(1)
        };
    };

    /**
     * Returns a translation message. Use `Lang.get()` method instead, this methods assumes the key exists.
     *
     * @param key {string} The key of the message.
     * @param locale {string} The locale of the message
     *
     * @return {string} The translation message for the given key.
     */
    Lang.prototype._getMessage = function(key, locale) {
        locale = locale || this.getLocale();
        
        key = this._parseKey(key, locale);

        // Ensure message source exists.
        if (this.messages[key.source] === undefined && this.messages[key.sourceFallback] === undefined) {
            return null;
        }

        // Get message from default locale.
        var message = this.messages[key.source];
        var entries = key.entries.slice();
        var subKey = entries.join('.');
        message = message !== undefined ? this._getValueInKey(message, subKey) : undefined;


        // Get message from fallback locale.
        if (typeof message !== 'string' && this.messages[key.sourceFallback]) {
            message = this.messages[key.sourceFallback];
            entries = key.entries.slice();
            subKey = '';
            while (entries.length && message !== undefined) {
                var subKey = !subKey ? entries.shift() : subKey.concat('.', entries.shift());
                if (message[subKey]) {
                    message = message[subKey]
                    subKey = '';
                }
            }
        }

        if (typeof message !== 'string') {
            return null;
        }

        return message;
    };

    Lang.prototype._getValueInKey = function(obj, str) {
        // If the full key exists just return the value
        if (typeof obj[str] === 'string') {
            return obj[str]
        }

        str = str.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        str = str.replace(/^\./, '');           // strip a leading dot

        var parts = str.split('.');

        for (var i = 0, n = parts.length; i < n; ++i) {
            var currentKey = parts.slice(0, i + 1).join('.');
            var restOfTheKey = parts.slice(i + 1, parts.length).join('.')
            
            if (obj[currentKey]) {
                return this._getValueInKey(obj[currentKey], restOfTheKey)
            }
        }

        return obj;
    };

    /**
     * Return the locale to be used between default and fallback.
     * @param {String} key
     * @return {String}
     */
    Lang.prototype._getLocale = function(key) {
        key = this._parseKey(key, this.locale)
        if (this.messages[key.source]) {
            return this.locale;
        }
        if (this.messages[key.sourceFallback]) {
            return this.fallback;
        }
        return null;
    };

    /**
     * Find a message in a translation tree using both dotted keys and regular ones
     *
     * @param pathSegments {array} An array of path segments such as ['family', 'father']
     * @param tree {object} The translation tree
     */
    Lang.prototype._findMessageInTree = function(pathSegments, tree) {
        while (pathSegments.length && tree !== undefined) {
            var dottedKey = pathSegments.join('.');
            if (tree[dottedKey]) {
                tree = tree[dottedKey];
                break;
            }

            tree = tree[pathSegments.shift()]
        }

        return tree;
    };

    /**
     * Sort replacement keys by length in descending order.
     *
     * @param a {string} Replacement key
     * @param b {string} Sibling replacement key
     * @return {number}
     * @private
     */
    Lang.prototype._sortReplacementKeys = function(a, b) {
        return b.length - a.length;
    };

    /**
     * Apply replacements to a string message containing placeholders.
     *
     * @param message {string} The text message.
     * @param replacements {object} The replacements to be done in the message.
     *
     * @return {string} The string message with replacements applied.
     */
    Lang.prototype._applyReplacements = function(message, replacements) {
        var keys = Object.keys(replacements).sort(this._sortReplacementKeys);

        keys.forEach(function(replace) {
            message = message.replace(new RegExp(':' + replace, 'gi'), function (match) {
                var value = replacements[replace];

                // Capitalize all characters.
                var allCaps = match === match.toUpperCase();
                if (allCaps) {
                    return value.toUpperCase();
                }

                // Capitalize first letter.
                var firstCap = match === match.replace(/\w/i, function(letter) {
                    return letter.toUpperCase();
                });
                if (firstCap) {
                    return value.charAt(0).toUpperCase() + value.slice(1);
                }

                return value;
            })
        });
        return message;
    };

    /**
     * Checks if the given `count` is within the interval defined by the {string} `interval`
     *
     * @param  count     {int}    The amount of items.
     * @param  interval  {string} The interval to be compared with the count.
     * @return {boolean}          Returns true if count is within interval; false otherwise.
     */
    Lang.prototype._testInterval = function(count, interval) {
        /**
         * From the Symfony\Component\Translation\Interval Docs
         *
         * Tests if a given number belongs to a given math interval.
         *
         * An interval can represent a finite set of numbers:
         *
         *  {1,2,3,4}
         *
         * An interval can represent numbers between two numbers:
         *
         *  [1, +Inf]
         *  ]-1,2[
         *
         * The left delimiter can be [ (inclusive) or ] (exclusive).
         * The right delimiter can be [ (exclusive) or ] (inclusive).
         * Beside numbers, you can use -Inf and +Inf for the infinite.
         */

        if (typeof interval !== 'string') {
            throw 'Invalid interval: should be a string.';
        }

        interval = interval.trim();

        var matches = interval.match(intervalRegexp);
        if (!matches) {
            throw 'Invalid interval: ' + interval;
        }

        if (matches[2]) {
            var items = matches[2].split(',');
            for (var i = 0; i < items.length; i++) {
                if (parseInt(items[i], 10) === count) {
                    return true;
                }
            }
        } else {
            // Remove falsy values.
            matches = matches.filter(function(match) {
                return !!match;
            });

            var leftDelimiter = matches[1];
            var leftNumber = convertNumber(matches[2]);
            if (leftNumber === Infinity) {
                leftNumber = -Infinity;
            }
            var rightNumber = convertNumber(matches[3]);
            var rightDelimiter = matches[4];

            return (leftDelimiter === '[' ? count >= leftNumber : count > leftNumber)
                && (rightDelimiter === ']' ? count <= rightNumber : count < rightNumber);
        }

        return false;
    };

    /**
     * Returns the plural position to use for the given locale and number.
     *
     * The plural rules are derived from code of the Zend Framework (2010-09-25),
     * which is subject to the new BSD license (http://framework.zend.com/license/new-bsd).
     * Copyright (c) 2005-2010 Zend Technologies USA Inc. (http://www.zend.com)
     *
     * @param {Number} count
     * @param {String} locale
     * @return {Number}
     */
    Lang.prototype._getPluralForm = function(count, locale) {
        switch (locale) {
            case 'az':
            case 'bo':
            case 'dz':
            case 'id':
            case 'ja':
            case 'jv':
            case 'ka':
            case 'km':
            case 'kn':
            case 'ko':
            case 'ms':
            case 'th':
            case 'tr':
            case 'vi':
            case 'zh':
                return 0;

            case 'af':
            case 'bn':
            case 'bg':
            case 'ca':
            case 'da':
            case 'de':
            case 'el':
            case 'en':
            case 'eo':
            case 'es':
            case 'et':
            case 'eu':
            case 'fa':
            case 'fi':
            case 'fo':
            case 'fur':
            case 'fy':
            case 'gl':
            case 'gu':
            case 'ha':
            case 'he':
            case 'hu':
            case 'is':
            case 'it':
            case 'ku':
            case 'lb':
            case 'ml':
            case 'mn':
            case 'mr':
            case 'nah':
            case 'nb':
            case 'ne':
            case 'nl':
            case 'nn':
            case 'no':
            case 'om':
            case 'or':
            case 'pa':
            case 'pap':
            case 'ps':
            case 'pt':
            case 'so':
            case 'sq':
            case 'sv':
            case 'sw':
            case 'ta':
            case 'te':
            case 'tk':
            case 'ur':
            case 'zu':
                return (count == 1)
                    ? 0
                    : 1;

            case 'am':
            case 'bh':
            case 'fil':
            case 'fr':
            case 'gun':
            case 'hi':
            case 'hy':
            case 'ln':
            case 'mg':
            case 'nso':
            case 'xbr':
            case 'ti':
            case 'wa':
                return ((count === 0) || (count === 1))
                    ? 0
                    : 1;

            case 'be':
            case 'bs':
            case 'hr':
            case 'ru':
            case 'sr':
            case 'uk':
                return ((count % 10 == 1) && (count % 100 != 11))
                    ? 0
                    : (((count % 10 >= 2) && (count % 10 <= 4) && ((count % 100 < 10) || (count % 100 >= 20)))
                        ? 1
                        : 2);

            case 'cs':
            case 'sk':
                return (count == 1)
                    ? 0
                    : (((count >= 2) && (count <= 4))
                        ? 1
                        : 2);

            case 'ga':
                return (count == 1)
                    ? 0
                    : ((count == 2)
                        ? 1
                        : 2);

            case 'lt':
                return ((count % 10 == 1) && (count % 100 != 11))
                    ? 0
                    : (((count % 10 >= 2) && ((count % 100 < 10) || (count % 100 >= 20)))
                        ? 1
                        : 2);

            case 'sl':
                return (count % 100 == 1)
                    ? 0
                    : ((count % 100 == 2)
                        ? 1
                        : (((count % 100 == 3) || (count % 100 == 4))
                            ? 2
                            : 3));

            case 'mk':
                return (count % 10 == 1)
                    ? 0
                    : 1;

            case 'mt':
                return (count == 1)
                    ? 0
                    : (((count === 0) || ((count % 100 > 1) && (count % 100 < 11)))
                        ? 1
                        : (((count % 100 > 10) && (count % 100 < 20))
                            ? 2
                            : 3));

            case 'lv':
                return (count === 0)
                    ? 0
                    : (((count % 10 == 1) && (count % 100 != 11))
                        ? 1
                        : 2);

            case 'pl':
                return (count == 1)
                    ? 0
                    : (((count % 10 >= 2) && (count % 10 <= 4) && ((count % 100 < 12) || (count % 100 > 14)))
                        ? 1
                        : 2);

            case 'cy':
                return (count == 1)
                    ? 0
                    : ((count == 2)
                        ? 1
                        : (((count == 8) || (count == 11))
                            ? 2
                            : 3));

            case 'ro':
                return (count == 1)
                    ? 0
                    : (((count === 0) || ((count % 100 > 0) && (count % 100 < 20)))
                        ? 1
                        : 2);

            case 'ar':
                return (count === 0)
                    ? 0
                    : ((count == 1)
                        ? 1
                        : ((count == 2)
                            ? 2
                            : (((count % 100 >= 3) && (count % 100 <= 10))
                                ? 3
                                : (((count % 100 >= 11) && (count % 100 <= 99))
                                    ? 4
                                    : 5))));

            default:
                return 0;
        }
    };

    return Lang;

}));
