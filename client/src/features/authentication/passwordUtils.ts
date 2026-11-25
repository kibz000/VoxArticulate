export function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Your password must contain at least 8 characters.'
  if (!/[A-Z]/.test(password)) return 'Add at least one uppercase letter.'
  if (!/[a-z]/.test(password)) return 'Add at least one lowercase letter.'
  if (!/[0-9]/.test(password)) return 'Add at least one number.'
  if (!/[^A-Za-z0-9\s]/.test(password)) return 'Add at least one special character, such as !, @ or #.'
  return null
}
