let c = 0

export async function toSmartEscape(e: KeyboardEvent, fn: () => unknown) {
  if (
    e.key !== 'Escape' ||
    (['TEXTAREA', 'INPUT'].some(t => t === (e?.target as HTMLElement).tagName) && ++c < 2)
  ) {
    return
  }

  c = 0
  fn()
}
