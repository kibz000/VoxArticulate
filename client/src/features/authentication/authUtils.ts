
export function getSafeNextPath(
  destination: string | null,
  fallback = '/dashboard',
): string {
  if (
    !destination ||
    !destination.startsWith('/') ||
    destination.startsWith('//') ||
    destination.includes('\\')
  ) {
    return fallback
  }

  return destination
}
