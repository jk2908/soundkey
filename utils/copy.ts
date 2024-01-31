export const copy = (str: unknown) =>
  navigator.clipboard.writeText(typeof str === 'string' ? str : JSON.stringify(str, null, 2))
