import { Spinner } from '@/components/global/spinner'
import { SkeletonText } from '@/components/global/skeleton-text'

export function SKTableRowLoader({ cells = 2 }: { cells?: number }) {
  return (
    <tr>
      {Array.from({ length: cells }, (_, idx) => (
        <td key={idx}>{idx === 0 ? <SkeletonText lines={1} /> : <Spinner size={16} />}</td>
      ))}
    </tr>
  )
}
