'use client'

import { useId } from 'react'

import { useTheme } from '@/hooks/use-theme'

import { FormGroup } from '@/components/global/form-group'
import * as Switch from '@/components/global/switch'

import { FormFieldDescription } from '../global/form-field-description'

export function UserSettingsForm() {
  const themeId = useId()

  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <form>
      <FormGroup>
        <Switch.Root
          id={themeId}
          isSelected={isDark}
          onChange={toggle}
          className="flex items-center gap-3">
          <Switch.Toggle />
          <Switch.Label>Dark mode</Switch.Label>
        </Switch.Root>

        <FormFieldDescription className="pt-1">
          Toggle dark mode on or off, this change will be saved for your next visit.
        </FormFieldDescription>
      </FormGroup>
    </form>
  )
}
