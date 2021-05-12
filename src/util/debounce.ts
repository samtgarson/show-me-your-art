// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/ban-types
export function debounce<
  Args extends unknown[],
  Func extends (...a: Args) => unknown
>(fn: Func) {
  let raf: number | undefined

  return (...args: Args) => {
    if (raf) return

    raf = window.requestAnimationFrame(() => {
      fn(...args)
      raf = undefined
    })
  }
}
