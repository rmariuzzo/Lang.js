import Lang from '../src/lang'
const messages = require('./fixture/messages')

describe("The Lang's locale methods", () => {
  let lang

  beforeEach(() => {
    lang = new Lang({ messages })
  })

  it('should return the default locale', () => {
    expect(lang.getLocale()).toBe('en')
  })

  it('should return the locale specified', () => {
    lang.setLocale('es')
    expect(lang.getLocale()).toBe('es')
  })

  it('should affect messages', () => {
    lang.setLocale('es')
    expect(lang.get('messages.home')).toBe('Inicio')

    lang.setLocale('en')
    expect(lang.get('messages.home')).toBe('Home')
  })

  it("should return the locale defined in HTML's lang attribute", () => {
    const globalAny: any = global
    globalAny.document.documentElement.lang = 'fr'

    lang = new Lang({ messages })
    expect(lang.getLocale()).toBe(globalAny.document.documentElement.lang)
  })
})
