import { Variant } from "@/lib/types"

type Props = {
  children: React.ReactNode
  type: Variant
}

export function Alert({ children }: Props) {
  return (
    <div className="p-4 mb-4 bg-gray-100 rounded-md">
      {children}
    </div>
  )
}