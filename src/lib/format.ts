/*

Really useless file
Converts seconds into nice format
e.g. 67 -> 1:07

*/

export function mmss(seconds: number): string {
  if (!isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}