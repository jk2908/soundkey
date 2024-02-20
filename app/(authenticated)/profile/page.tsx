import { redirect } from 'next/navigation'
import { getProfile } from '@/actions/profile/handlers'

import { auth } from '@/lib/auth'

import { UpdateProfileForm } from '@/components/authenticated/update-profile-form'
import { ProseBox } from '@/components/global/prose-box'

export default async function Page() {
  const user = await auth()

  if (!user) throw redirect('/login')

  const { userId } = user
  const { username, bio } = await getProfile(userId)

  return (
    <ProseBox>
      <h1 className="sr-only">Profile</h1>
      <UpdateProfileForm userId={userId} username={username} bio={bio} />
    </ProseBox>
  )
}
