export const isVisible = (el: HTMLElement) =>
  Boolean(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
