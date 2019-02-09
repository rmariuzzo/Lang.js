import { get } from 'lodash'
import { Key, Messages, Options, Replacements, FlattenObject } from './types'
import { applyReplacements, testInterval, getPluralForm, inferLocale, flat } from './utils'

const DEFAULT_LOCALE = 'en'
const anyIntervalRegexp = /({\s*(\-?\d+(\.\d+)?[\s*,\s*\-?\d+(\.\d+)?]*)\s*})|([\[\]])\s*(-Inf|\*|\-?\d+(\.\d+)?)\s*,\s*(\+?Inf|\*|\-?\d+(\.\d+)?)\s*([\[\]])/

export default class Lang {
  locale: string = null
  fallback: string = null
  messages: FlattenObject = null

  constructor(options: Options) {
    this.locale = options.locale || inferLocale() || DEFAULT_LOCALE
    this.fallback = options.fallback
    this.setMessages(options.messages)
  }

  setMessages(messages: Messages) {
    this.messages = flat(messages)
  }

  getLocale() : string | null {
    return this.locale
  }

  setLocale(locale: string) : void {
    this.locale = locale
  }

  getFallback() : string | null {
    return this.fallback
  }

  setFallback(fallback: string) : void {
    this.fallback = fallback
  }

  get(key: string, replacements?: Replacements, locale?: string) : string | null {
    if (!key) {
      return null
    }

    key = key.replace(/\//g, '.')

    const { source, sourceFallback } = this._parseKey(key, locale)
    let message = get(this.messages, source, null)
  
    if (message === null) {
      message = get(this.messages, sourceFallback, null)

      if (message === null) {
        return key
      }
    }

    if (replacements) {
      return applyReplacements(message, replacements)
    }

    return message
  }

  trans(key: string, replacements: Replacements, locale: string) : string | null {
    return this.get(key, replacements, locale)
  }

  has(key: string, locale: string) : boolean {
    const message = this.get(key, null, locale)
    return message !== null && message !== key
  }

  choice(key: string, number: number, replacements: Replacements = {}, locale: string) : string | null {
    replacements.count = number

    const message = this.get(key, replacements, locale)

    if (message === null) {
      return message
    }

    const messageParts = message.split('|')
    const explicitRules = []

    for (let i = 0; i < messageParts.length; i++) {
      messageParts[i] = messageParts[i].trim()

      if (anyIntervalRegexp.test(messageParts[i])) {
        const messageSpaceSplit = messageParts[i].split(/\s/)
        explicitRules.push(messageSpaceSplit.shift())
        messageParts[i] = messageSpaceSplit.join(' ')
      }
    }

    // Check if there's only one message
    if (messageParts.length === 1) {
      // Nothing to do here
      return message
    }

    // Check the explicit rules
    for (let j = 0; j < explicitRules.length; j++) {
      if (testInterval(number, explicitRules[j])) {
        return messageParts[j]
      }
    }

    locale = locale || this._getLocaleFromExistingMessage(key, locale)
    var pluralForm = getPluralForm(number, locale)

    return messageParts[pluralForm]
  }

  transChoice(key: string, number: number, replacements: object, locale: string) : string | null {
    return this.choice(key, number, replacements, locale)
  }

  _getLocaleFromExistingMessage(key: string, locale: string) : string {
    const keyObj = this._parseKey(key, locale)

    if (this.messages[keyObj.source]) {
      return this.locale
    }

    if (this.messages[keyObj.sourceFallback]) {
      return this.fallback
    }

    return null
  }

  _parseKey(key: string, locale: string) : Key {
    key = key.replace(/\//g, '.')

    return {
      source: `${locale || this.locale}.${key}`,
      sourceFallback: `${this.fallback}.${key}`,
    }
  }
}
