import Lang from '../src/lang'
const messages = require('./fixture/messages')

describe('The lang.has() method', () => {
  let lang

  beforeEach(() => {
    lang = new Lang({
      messages: messages
    })
  })

  it('should return false when the given key is no defined', () => {
    expect(lang.has('foo.bar')).toBe(false)
    expect(lang.has(null)).toBe(false)
  })

  it('should return true when the given key is defined', () => {
    expect(lang.has('messages.home')).toBe(true)
    expect(lang.has('validation.accepted')).toBe(true)
  })

  it('should return true when the given key and locale are defined',() => {
    expect(lang.has('messages.home', 'es')).toBe(true)
    expect(lang.has('messages.home', 'ht')).toBe(true)
  })

  it('should return false when the locale of a existing key is not defined', () => {
    expect(lang.has('messages.home', 'bla')).toBe(false)
    expect(lang.has('validation.accepted', 'bla')).toBe(false)
  })
})
