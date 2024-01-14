export function debounce<T extends Array<unknown>>(callback: (...args: T) => void, wait: number) {
  let timeoutId: ReturnType<typeof setTimeout> | number | undefined = undefined

  return (...args: T) => {
    window.clearTimeout(timeoutId)

    timeoutId = window.setTimeout(() => {
      callback.apply(null, args)
    }, wait)
  }
}
