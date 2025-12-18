import { safeParseStorageData } from '../services/data-io.js'
import {
  storageDataJsonInvalidPriority,
  storageDataJsonMissingArrays,
  storageDataJsonValid,
} from './mocks/data.js'

describe('data-io safeParseStorageData', () => {
  test('returns StorageData for a valid payload', () => {
    const parsed = safeParseStorageData(storageDataJsonValid)
    expect(parsed).not.toBeNull()
    expect(parsed?.version).toBe('1')
    expect(parsed?.theme).toBe('dark')
    expect(parsed?.projects).toHaveLength(1)
    expect(parsed?.todos).toHaveLength(1)
    expect(parsed?.exportedAt).toBe('2025-12-18T12:00:00.000Z')
  })

  test('rejects payload without todos/projects arrays', () => {
    const parsed = safeParseStorageData(storageDataJsonMissingArrays)
    expect(parsed).toBeNull()
  })

  test('rejects payload with invalid todo priority', () => {
    const parsed = safeParseStorageData(storageDataJsonInvalidPriority)

    expect(parsed).toBeNull()
  })
})
