import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Notifications } from './notifications'
import type { NotificationsRepository } from '../repositories/notifications.repository'

class MockNotificationsRepository implements NotificationsRepository {
  private callback: (() => void) | null = null

  onNewNotification(callback: () => void): void {
    this.callback = callback
  }

  disconnect(): void {
    this.callback = null
  }

  simulateNotification(): void {
    if (this.callback) {
      this.callback()
    }
  }
}

describe('Notifications', () => {
  let notifications: Notifications
  let mockRepository: MockNotificationsRepository

  beforeEach(() => {
    mockRepository = new MockNotificationsRepository()
    notifications = new Notifications(mockRepository)
    document.body.appendChild(notifications)
  })

  it('should render the component correctly', () => {
    const container = document.querySelector('.fixed')
    expect(container).not.toBeNull()
    expect(container?.classList.contains('hidden')).toBe(true)
  })

  it('should show notification when one is received', () => {
    mockRepository.simulateNotification()

    const container = document.querySelector('.fixed')
    expect(container?.classList.contains('hidden')).toBe(false)

    const counter = document.querySelector('.absolute')
    expect(counter?.textContent).toBe('1')
  })

  it('should increment counter when multiple notifications are received', () => {
    mockRepository.simulateNotification()
    mockRepository.simulateNotification()

    const counter = document.querySelector('.absolute')
    expect(counter?.textContent).toBe('2')
  })

  it('should clean up repository when component is disconnected', () => {
    const disconnectSpy = vi.spyOn(mockRepository, 'disconnect')

    notifications.remove()

    expect(disconnectSpy).toHaveBeenCalled()
  })
})
