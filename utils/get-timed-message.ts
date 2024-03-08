export function getTimedMessage(t: number, str?: string) {
  const d = new Date(t)
  const h = d.getHours()

  switch (true) {
    case h < 12:
      return 'Good morning'
    case h < 17:
      return 'Good afternoon'
    case h < 20:
      return 'Good evening'
    default:
      return `Working late${str ? ', ' + str : ''}?`
  }
}
