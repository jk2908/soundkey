export function copyToClipboard(str: unknown) {
  return navigator.clipboard.writeText(typeof str === 'string' ? str : JSON.stringify(str, null, 2))
}
