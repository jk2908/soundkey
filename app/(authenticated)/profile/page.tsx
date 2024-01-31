import { auth } from '@/lib/auth'

export default async function Page() {
  const user = await auth()

  if (!user) {
    return
  }

  return (
    <>{Object.entries(user)}</>
  )
}
