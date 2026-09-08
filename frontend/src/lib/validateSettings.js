import { FIELD_KEYS, FIELD_LABELS } from './fields'

export function validateSettings(settings) {
  const errors = {}
  for (const key of FIELD_KEYS) {
    const value = settings[key]
    const label = FIELD_LABELS[key]
    if (value === '' || value === null || value === undefined || Number.isNaN(value)) {
      errors[key] = `${label} must be a number`
    } else if (value < 0) {
      errors[key] = `${label} can't be negative`
    }
  }
  return errors
}
