export const toLocaleFromTimestamp = (n: number | null) => (n ? new Date(n).toLocaleString() : null)
