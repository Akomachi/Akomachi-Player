let order: string[] = []
let index = -1

export const queue = {
  set(ids: string[], startAt = 0) {
    order = ids
    index = startAt
  },
  current: (): string | null => order[index] ?? null,
  next: (): string | null => (index < order.length - 1 ? order[++index] : null),
  prev: (): string | null => (index > 0 ? order[--index] : null),
  hasNext: () => index < order.length - 1,
  hasPrev: () => index > 0,
}
