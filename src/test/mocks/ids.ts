export const fixedIds = (...ids: string[]) => {
  let i = 0
  return { nextId: () => ids[i++] ?? `id-${i}` }
}
