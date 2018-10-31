declare module 'lang.js' {
    interface Messages {
        [key: string]: {
            [name: string]: string
        }
    }

    interface Replacements {
        [key: string]: string
    }

    export interface LangOptions {
        locale?: string;
        fallback?: string;
        messages?: any;
    }

    export default class Lang {
        constructor(options: LangOptions);
        setMessages(messages: Messages): void;
        getLocale(): string;
        setLocale(locale: string): void;
        getFallback(): string;
        setFallback(fallback: string): void;
        has(key: string, locale?: string): boolean;
        get(key: string, replacements?: Replacements, locale?: string): string;
        trans(key: string, replacements?: Replacements): string;
        choice(key: string, number: number, replacements?: Replacements, locale?: string): string;
        transChoice(key: string, count: number, replacements?: Replacements): string;
    }
}