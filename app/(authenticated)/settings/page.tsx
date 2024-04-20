import { UserSettingsForm } from '@/components/authenticated/user-settings-form'
import { Heading } from '@/components/global/heading'
import { YSpace } from '@/components/global/y-space'
import { KeylineBox } from '@/components/global/keyline-box'

export default function Page() {
  return (
    <YSpace className="flex grow flex-col">
      <Heading level={1} className="sr-only">
        Settings
      </Heading>

      <KeylineBox fill>
        <Heading level={2} className="mb-6">
          User settings
        </Heading>

        <UserSettingsForm />
      </KeylineBox>
    </YSpace>
  )
}
