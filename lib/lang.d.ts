import { Key, Messages, Options, Replacements, FlattenObject } from "./types";
export default class Lang {
  locale: string;
  fallback: string;
  messages: FlattenObject;
  constructor(options: Options);
  setMessages(messages: Messages): void;
  getLocale(): string | null;
  setLocale(locale: string): void;
  getFallback(): string | null;
  setFallback(fallback: string): void;
  get(key: string, replacements?: Replacements, locale?: string): string | null;
  trans(key: string, replacements: Replacements, locale: string): string | null;
  has(key: string, locale: string): boolean;
  choice(
    key: string,
    number: number,
    replacements: Replacements,
    locale: string
  ): string | null;
  transChoice(
    key: string,
    number: number,
    replacements: object,
    locale: string
  ): string | null;
  _getLocaleFromExistingMessage(key: string, locale: string): string;
  _parseKey(key: string, locale: string): Key;
}
