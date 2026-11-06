export const getDateFromPath = (photoPath: string): string => {
  const match = photoPath.match(/(?:^|[\\/])(\d{4}-\d{2}-\d{2})(?:[\\/]|$)/)
  return match?.[1] ?? 'Sin fecha'
}