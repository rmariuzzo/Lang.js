export type Messages = {
  [message: string] : {
    [key: string]: string
  }
}

export type FlattenObject = {
  [flattenKey: string]: string
}

export type Options = {
  messages: Messages,
  locale?: string,
  fallback?: string
}

export type Replacements = {
  count?: any,
  [key: string]: any,
}

export type Key = {
  source: string,
  sourceFallback: string,
}
