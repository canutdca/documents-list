import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatRelativeDate } from './date.utils'

describe('formatRelativeDate', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return "just now" for dates less than a minute ago', () => {
    const now = new Date('2024-03-20T12:00:00Z')
    vi.setSystemTime(now)
    const date = new Date('2024-03-20T11:59:30Z')
    expect(formatRelativeDate(date)).toBe('just now')
  })

  it('should format minutes correctly', () => {
    const now = new Date('2024-03-20T12:00:00Z')
    vi.setSystemTime(now)
    const date = new Date('2024-03-20T11:58:00Z')
    expect(formatRelativeDate(date)).toBe('2 minutes ago')
  })

  it('should format hours correctly', () => {
    const now = new Date('2024-03-20T12:00:00Z')
    vi.setSystemTime(now)
    const date = new Date('2024-03-20T10:00:00Z')
    expect(formatRelativeDate(date)).toBe('2 hours ago')
  })

  it('should format days correctly', () => {
    const now = new Date('2024-03-20T12:00:00Z')
    vi.setSystemTime(now)
    const date = new Date('2024-03-18T12:00:00Z')
    expect(formatRelativeDate(date)).toBe('2 days ago')
  })

  it('should format months correctly', () => {
    const now = new Date('2024-03-20T12:00:00Z')
    vi.setSystemTime(now)
    const date = new Date('2024-01-20T12:00:00Z')
    expect(formatRelativeDate(date)).toBe('2 months ago')
  })

  it('should format years correctly', () => {
    const now = new Date('2024-03-20T12:00:00Z')
    vi.setSystemTime(now)
    const date = new Date('2022-03-20T12:00:00Z')
    expect(formatRelativeDate(date)).toBe('2 years ago')
  })

  it('should handle singular forms correctly', () => {
    const now = new Date('2024-03-20T12:00:00Z')
    vi.setSystemTime(now)
    const date = new Date('2024-03-20T11:59:00Z')
    expect(formatRelativeDate(date)).toBe('1 minute ago')
  })
})
