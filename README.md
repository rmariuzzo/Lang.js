![Lang.js – Localization library written in JavaScript highly inspired on Laravel's Lang.](.github/banner.png)

![Laravel 5.5](https://img.shields.io/badge/Laravel-5.5-f4645f.svg)
![Laravel 5.0](https://img.shields.io/badge/Laravel-5.0-f4645f.svg)
![NPM Montly Downloads](https://img.shields.io/npm/dm/lang.js.svg)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/rmariuzzo/Lang.js/master/LICENSE)

<br>
<br>
<br>

# Installation

```bash
npm install lang.js@next
```

<br>

# Documentation

## Initialization

```js
var lang = new Lang({
  messages: source, // required
  locale: "fr", // optional
  fallback: "zn" // optional
});
```

### Messages source format

The messages source format looks like this:

```js
{
    "locale-1.mesages-name": {
        "key-1": "value-1",
        "key-2": "value-2",
        // ... and more key-value pairs.
    },
    "locale-2.mesages-name": {
        "key-1": "value-1",
        "key-2": "value-2",
        // ... and more key-value pairs.
    },
    // ... and more locales.
}
```

See the sample used in tests located at: `test/fixture/messages.json`.

<br>

## API

### `setMessages`

Set messages source. Check [messages source format](#messages-source-format).

```js
lang.setMessages(source);
```

### `getLocale`

Get the current locale, if none set, the default locale will be returned (`en`).

```js
lang.getLocale();
// > "en"
```

### `setLocale`

Set the current locale.

```js
lang.setLocale("ht");
```

### `getFallback`

Get the fallback locale.

```js
lang.getFallback();
// > de
```

### `setFallback`

Set the fallback locale for messages not found using the default locale.

```js
var lang = new Lang({
  messages: {
    "en.greetings": {
      hi: "Hi",
      hello: "Hello"
    },
    "it.greetings": {
      hi: "Salve"
    }
  }
});

lang.setLocale("it");
lang.get("greetings.hello");
// > "greetings.hello"

lang.setFallback("en");
lang.get("greetings.hello");
// > "Hello"
```

### `has`

Indicate if a given key is defined on the messages source.

```js
lang.has("greetings.hi");
```

### `get`

Get a translation message.

```js
lang.get("greetings.hi");
lang.get("forum/thread.hello");
```

### `trans`

This method act as an alias of [`get()`](#get).

### `choice`

Get the plural or singular form of the message specified based on an integer value.

```js
lang.choice("fruits.apple", 1);
// > "apple"

lang.choice("fruits.apple", 4);
// > "apples"
```

You may even create more complex pluralization rules which specify translation strings for multiple number ranges:

```js
var lang = new Lang({
  messages: {
    "en.fruits": {
      apple: "{0} There are none|[1,19] There are some|[20,*] There are many"
    }
  }
});

lang.choice("fruits.apple", 0);
// > "There are none"

lang.choice("fruits.apple", 1);
// > "There are some"

lang.choice("fruits.apple", 3);
// > "There are some"

lang.choice("fruits.apple", 20);
// > "There are many"

lang.choice("fruits.apple", 22);
// > "There are many
```

### `transChoice`

This method act as an alias of [`choice()`](#choice).

<br>

# Development

1.  Fork this repository and clone it.
2.  Create a branch from `next` branch.
3.  Submit a PR to be merge into `next` branch.

<br>

# Testing

To run the tests use the following commands:

- Single run: `npm run test`

<br>

# Deployment

We do deployment using `np`:

```bash
np 2.0.0-beta.n --tag=next --any-branch
```
