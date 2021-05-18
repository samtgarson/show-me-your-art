export const matcher =
  (paths: string[]) =>
  (path: string): boolean =>
    new RegExp(
      paths.map(str => '^' + str.replace('*', '[^/]+') + '$').join('|')
    ).test(path)
