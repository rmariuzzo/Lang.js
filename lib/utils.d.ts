import { FlattenObject } from "./types";
export declare function inferLocale(): string;
export declare function convertNumber(str: string): number;
export declare function applyReplacements(
  message: string,
  replacements: object
): string;
export declare function testInterval(count: number, interval: string): boolean;
/**
 * Returns the plural position to use for the given locale and number.
 *
 * The plural rules are derived from code of the Zend Framework (2010-09-25),
 * which is subject to the new BSD license (http://framework.zend.com/license/new-bsd).
 * Copyright (c) 2005-2010 Zend Technologies USA Inc. (http://www.zend.com)
 */
export declare function getPluralForm(count: number, locale: string): number;
export declare function flat(obj: object, path?: string): FlattenObject;
