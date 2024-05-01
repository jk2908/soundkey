import { Section } from '#/components/global/section'
import { ThemeToggle } from '#/components/global/theme-toggle'
import { Wrapper } from '#/components/global/wrapper'
import { Nav  } from '#/components/unauthenticated/nav'

export function Header() {
  return (
    <Wrapper>
      <Section className="flex items-center justify-between">
        <ThemeToggle />

        <Nav />
      </Section>
    </Wrapper>
  )
}
