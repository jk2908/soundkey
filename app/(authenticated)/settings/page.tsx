import { UserSettingsForm } from '@/components/authenticated/user-settings-form'
import { BodyHeading } from '@/components/global/body-heading'
import { YSpace } from '@/components/global/y-space'
import { KeylineBox } from '@/components/global/keyline-box'

export default function Page() {
  return (
    <YSpace className="flex grow flex-col">
      <BodyHeading level={1} className="sr-only">
        Settings
      </BodyHeading>

      <KeylineBox fill>
        <BodyHeading level={2} className="mb-6">
          User settings
        </BodyHeading>

        <UserSettingsForm />
      </KeylineBox>
    </YSpace>
  )
}
