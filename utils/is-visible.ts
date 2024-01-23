export const isVisible = (element: HTMLElement) =>
  Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length)
