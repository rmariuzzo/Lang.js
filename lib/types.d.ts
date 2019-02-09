export declare type Messages = {
  [message: string]: {
    [key: string]: string;
  };
};
export declare type FlattenObject = {
  [flattenKey: string]: string;
};
export declare type Options = {
  messages: Messages;
  locale?: string;
  fallback?: string;
};
export declare type Replacements = {
  count?: any;
  [key: string]: any;
};
export declare type Key = {
  source: string;
  sourceFallback: string;
};
