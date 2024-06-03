import { useEffect, useState } from 'react'

export function useMediaQuery(query: string) {
  const [isMatching, setMatching] = useState(false)

  useEffect(() => {
    const mq = matchMedia(query)

    setMatching(mq.matches)

    const handler = ({ matches }: MediaQueryListEvent) => setMatching(matches)

    mq.addEventListener('change', handler)

    return () => {
      mq.removeEventListener('change', handler)
    }
  }, [query])

  return isMatching
}
