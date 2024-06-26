import { KeylineBox } from '#/components/global/keyline-box'
import * as Tabs from '#/components/global/tabs'
import { LoginForm } from '#/components/unauthenticated/login-form'
import { SignupForm } from '#/components/unauthenticated/signup-form'

export default async function Page() {
  return (
    <KeylineBox>
      <Tabs.Root initialValue="signup" loop>
        <div className="space-y-8">
          <Tabs.List className="sk-rounded-tab-group max-w-prose mx-auto">
            <Tabs.Button value="signup">
              Signup
            </Tabs.Button>
            <Tabs.Button value="login">
              Login
            </Tabs.Button>
          </Tabs.List>

          <Tabs.Panel value="signup" className="sk-focus rounded-xl">
            <SignupForm />
          </Tabs.Panel>

          <Tabs.Panel value="login" className="sk-focus rounded-xl">
            <LoginForm />
          </Tabs.Panel>
        </div>
      </Tabs.Root>
    </KeylineBox>
  )
}
