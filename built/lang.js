import {
  applyReplacements,
  testInterval,
  getPluralForm,
  inferLocale,
  flat
} from "./utils";
var DEFAULT_LOCALE = "en";
var anyIntervalRegexp = /({\s*(\-?\d+(\.\d+)?[\s*,\s*\-?\d+(\.\d+)?]*)\s*})|([\[\]])\s*(-Inf|\*|\-?\d+(\.\d+)?)\s*,\s*(\+?Inf|\*|\-?\d+(\.\d+)?)\s*([\[\]])/;
var Lang = /** @class */ (function() {
  function Lang(options) {
    this.locale = null;
    this.fallback = null;
    this.messages = null;
    this.locale = options.locale || inferLocale() || DEFAULT_LOCALE;
    this.fallback = options.fallback;
    this.setMessages(options.messages);
  }
  Lang.prototype.setMessages = function(messages) {
    this.messages = flat(messages);
  };
  Lang.prototype.getLocale = function() {
    return this.locale;
  };
  Lang.prototype.setLocale = function(locale) {
    this.locale = locale;
  };
  Lang.prototype.getFallback = function() {
    return this.fallback;
  };
  Lang.prototype.setFallback = function(fallback) {
    this.fallback = fallback;
  };
  Lang.prototype.get = function(key, replacements, locale) {
    if (!key) {
      return null;
    }
    key = key.replace(/\//g, ".");
    var _a = this._parseKey(key, locale),
      source = _a.source,
      sourceFallback = _a.sourceFallback;
    var message = this.messages[source];
    if (message === undefined) {
      message = this.messages[sourceFallback];
      if (message === undefined) {
        return key;
      }
    }
    if (replacements) {
      return applyReplacements(message, replacements);
    }
    return message;
  };
  Lang.prototype.trans = function(key, replacements, locale) {
    return this.get(key, replacements, locale);
  };
  Lang.prototype.has = function(key, locale) {
    var message = this.get(key, null, locale);
    return message !== null && message !== key;
  };
  Lang.prototype.choice = function(key, number, replacements, locale) {
    if (replacements === void 0) {
      replacements = {};
    }
    replacements.count = number;
    var message = this.get(key, replacements, locale);
    if (message === null) {
      return message;
    }
    var messageParts = message.split("|");
    var explicitRules = [];
    for (var i = 0; i < messageParts.length; i++) {
      messageParts[i] = messageParts[i].trim();
      if (anyIntervalRegexp.test(messageParts[i])) {
        var messageSpaceSplit = messageParts[i].split(/\s/);
        explicitRules.push(messageSpaceSplit.shift());
        messageParts[i] = messageSpaceSplit.join(" ");
      }
    }
    // Check if there's only one message
    if (messageParts.length === 1) {
      // Nothing to do here
      return message;
    }
    // Check the explicit rules
    for (var j = 0; j < explicitRules.length; j++) {
      if (testInterval(number, explicitRules[j])) {
        return messageParts[j];
      }
    }
    locale = locale || this._getLocaleFromExistingMessage(key, locale);
    var pluralForm = getPluralForm(number, locale);
    return messageParts[pluralForm];
  };
  Lang.prototype.transChoice = function(key, number, replacements, locale) {
    return this.choice(key, number, replacements, locale);
  };
  Lang.prototype._getLocaleFromExistingMessage = function(key, locale) {
    var keyObj = this._parseKey(key, locale);
    if (this.messages[keyObj.source]) {
      return this.locale;
    }
    if (this.messages[keyObj.sourceFallback]) {
      return this.fallback;
    }
    return null;
  };
  Lang.prototype._parseKey = function(key, locale) {
    key = key.replace(/\//g, ".");
    return {
      source: (locale || this.locale) + "." + key,
      sourceFallback: this.fallback + "." + key
    };
  };
  return Lang;
})();
export default Lang;
