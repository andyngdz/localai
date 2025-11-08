/**
 * Default styles applied on first visit or model switch
 * Only applied when styles array is empty
 */
export const DEFAULT_STYLE_IDS = [
  'fooocus_masterpiece',
  'fooocus_negative'
] as const

export type DefaultStyleId = (typeof DEFAULT_STYLE_IDS)[number]
