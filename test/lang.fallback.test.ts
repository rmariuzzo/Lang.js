import Lang from '../src/lang'
const messages = require('./fixture/messages')

describe('The lang\'s fallback locale feature', () => {
  let lang

  beforeEach(() => {
    lang = new Lang({ messages })
  })

  it('should set default fallback', () => {
    lang.setFallback('es')
    expect(lang.getFallback()).toBe('es')
  })

  it('should get the message using the fallback locale when the message does not exist in the defined locale', () => {
    lang = new Lang({
      messages: {
        'en.greetings': {
          'hi': 'Hi',
          'hello': 'Hello'
        },
        'it.greetings': {
          'hi': 'Salve'
        }
      }
    })

    lang.setLocale('it')
    expect(lang.get('greetings.hello')).toBe('greetings.hello')

    lang.setFallback('en')
    expect(lang.get('greetings.hello')).toBe('Hello')
  })

  it('should not throw an error when the message is not defined and a fallback is set', () => {
    lang = new Lang({
      messages: {
        'en.greetings': {
          'hi': 'Hi',
          'hello': 'Hello'
        }
      }
    })
    lang.setLocale('it')
    lang.setFallback('en')

    expect(() => lang.get('greetings.hello')).not.toThrow()
  })
})
