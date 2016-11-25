# Lang.js

[![Join the chat at https://gitter.im/rmariuzzo/Lang.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/rmariuzzo/Lang.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/rmariuzzo/Lang.js.svg)](https://travis-ci.org/rmariuzzo/Lang.js)
![Laravel 5.0](https://img.shields.io/badge/Laravel-5.0-f4645f.svg)
![Laravel 5.1](https://img.shields.io/badge/Laravel-5.1-f4645f.svg)
![Laravel 5.2](https://img.shields.io/badge/Laravel-5.2-f4645f.svg)
![Laravel 5.3](https://img.shields.io/badge/Laravel-5.3-f4645f.svg)
![NPM Montly Downloads](https://img.shields.io/npm/dm/lang.js.svg)
![NPM package](https://img.shields.io/badge/NPM-%E2%9C%93-cb3837.svg)
![Bower package](https://img.shields.io/badge/bower-%E2%9C%93-FFCC2F.svg)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/rmariuzzo/Lang.js/master/LICENSE)

Localization library written in JavaScript highly inspired on Laravel's Lang.

 > 💁 **Heads up!** This repository host the JavaScript library used for [Laravel JS Localization](https://github.com/rmariuzzo/Laravel-JS-Localization). If you are already using Laravel JS Localization you don't need to use this too as it come automatically bundled.

## Installation

Different installation methods:

 - Bower: `bower install lang.js`
 - NPM: `npm install lang.js`
 - Manually: [Download latest release](https://github.com/rmariuzzo/Lang.js/releases/latest)

## Documentation

### Initialization

```js
var lang = new Lang({
    messages: source,
    locale: 'fr',
    fallback: 'zn'
});
```

To use `Lang.js` we need to specify at least the messages sources. This can be done during instantiation as shown in the previous code or later using the [`setMessages()`](#setmessages) method.

### Messages source format

The messages source format looks like:

```js
{
    "locale1.name": {
        "key1": "value1",
        "key2": "value2",
        // ... and more key-value pairs.
    },
    "locale2.name": {
        "key1": "value1",
        "key2": "value2",
        // ... and more key-value pairs.
    },
    // ... and more locales.
}
```

See the sample used in tests located at: `test/fixture/messages.json`.

### Methods

#### `setMessages`

Set messages source. Check [messages source format](#messages-source-format).

```js
var lang = new Lang();
lang.setMessages(source);
```

#### `getLocale`

Get the current locale, if none set, the default locale will be returned (`en`).

```js
var lang = new Lang();

lang.getLocale();
// > "en"

lang.setLocale('fr');
lang.getLocale();
// > "fr"
```

#### `setLocale`

Set the current locale.

```js
var lang = new Lang();

lang.setLocale('ht');
lang.getLocale();
// > "ht"
```

#### `getFallback`

Get the fallback locale.

```js
var lang = new Lang();

lang.getFallback();
// > undefined

lang.setFallback('de');
lang.getFallback();
// > "de"
```

#### `setFallback`

Set the fallback locale. When retrieving a message (using [`get()`](#get) or [`has()`](#has)) which is not defined in the specified locale, then it will try to find a message with the fallback locale (if set).

```js
var lang = new Lang({
    messages: {
        'en.greetings': {
            'hi': 'Hi',
            'hello': 'Hello'
        },
        'it.greetings': {
            'hi': 'Salve'
        }
    }
});

lang.setLocale('it');
lang.get('greetings.hello');
// > "greetings.hello"

lang.setFallback('en');
lang.get('greetings.hello');
// > "Hello"
```

#### `has`

Indicate if a given key is defined on the messages source. Return `true` if the key is defined on the messages source, otherwise `false`. This method will try to get a message for the specified locale, if not found, then it will return a message for the fallback locale, if not found, then `false` will be returned.

```js
var lang = new Lang({
    messages: {
        'en.greetings': {
            'hi': 'Hi'
        },
        'es.greetings': {
            'hi': 'Hola'
        }
    }
});

lang.has('greetings.hi');
// > true

lang.has('greetings.hi', 'es');
// > true

lang.has('greetings.hello');
// > false
```

#### `get`

Get a translation message if found, otherwise return the given key. This method will try to get a message for the specified locale, if not found, then it will return a message for the fallback locale, if not found, then the given key will be returned.

```js
var lang = new Lang({
    messages: {
        'en.greetings': {
            'hi': 'Hi'
        },
        'es.greetings': {
            'hi': 'Hola'
        }
    }
});

lang.get('greetings.hi');
// > "Hi"

lang.get('greetings.hi', {}, 'es');
// > "Hola"

lang.get('greetings.hello');
// > "greetings.hello"
```

#### `trans`

This method act as an alias of [`get()`](#get).

#### `choice`

Get the plural or singular form of the message specified based on an integer value.

```js
var lang = new Lang({
    messages: {
        'en.fruits': {
            'apple': 'apple|apples'
        },
        'es.greetings': {
            'apple': 'manzana|manzanas'
        }
    }
});

lang.choice('fruits.apple', 1);
// > "apple"

lang.choice('fruits.apple', 4);
// > "apples"

lang.choice('fruits.apple', 4, {}, 'es');
// > "manzanas"
```

#### `transChoice`

This method act as an alias of [`choice()`](#choice).


## Development

 1. Fork this repository and clone it.
 2. Create a branch from develop: `git checkout -b feature/xxxxxxx`
 3. Submit a PR to be merge into develop branch.

**[Get help!](https://gitter.im/rmariuzzo/Lang.js)**

## Testing

To run the tests use the following commands:

 - Single run: `npm run test`
 - Run on changes: `npm run test:watch`
