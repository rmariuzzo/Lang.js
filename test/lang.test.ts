import Lang from '../src/lang'
const messages = require('./fixture/messages')

describe('The Lang class object', () => {
  it('should not throw on non options', () => {
    expect(() => {
      const lang = new Lang(null)
      lang.get('foo')
    }).toThrow()
  })

  it('should not throw on non messages', () => {
    expect(() => {
      const lang = new Lang({ messages: null })
      lang.get('foo')
    }).not.toThrow()
  })
})
