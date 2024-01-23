import * as Tabs from '@/components/global/tabs'
import { LoginForm } from '@/components/unauthenticated/login-form'
import { SignupForm } from '@/components/unauthenticated/signup-form'

export default function Page() {
  return (
    <div className="xs:border xs:rounded-2xl xs:border-keyline xs:p-8 sm:p-12">
      <Tabs.Root initialValue="signup" loop={true}>
        <div className="space-y-8">
          <Tabs.List className="rounded-tab-group max-w-72 mx-auto">
            <Tabs.Button value="signup">Signup</Tabs.Button>
            <Tabs.Button value="login">Login</Tabs.Button>
            <Tabs.Button value="test">Test</Tabs.Button>
          </Tabs.List>

          <Tabs.Panel value="signup">
            <SignupForm />
          </Tabs.Panel>

          <Tabs.Panel value="login">
            <LoginForm />
          </Tabs.Panel>

          <Tabs.Panel value="test">
            Test panel no focusable elements
          </Tabs.Panel>
        </div>
      </Tabs.Root>
    </div>
  )
}
