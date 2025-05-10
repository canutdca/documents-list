import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Notifications } from './notifications'
import type { NotificationsRepository } from '../repositories/notifications.repository'
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom'

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
    expect(
      document.querySelector('notifications-component')
    ).toBeInTheDocument()
  })

  it('should be hidden on startup', () => {
    const container = screen.getByRole('status', {
      name: 'New documents created alert',
    })
    expect(container).toHaveClass('hidden')
  })

  it('should show notification when one is received', () => {
    mockRepository.simulateNotification()

    const container = screen.getByRole('status', {
      name: 'New documents created alert',
    })
    expect(container).not.toHaveClass('hidden')

    const counter = screen.getByRole('status', {
      name: 'Counter of new documents created',
    })
    expect(counter).toHaveTextContent('1')
  })

  it('should increment counter when multiple notifications are received', () => {
    mockRepository.simulateNotification()
    mockRepository.simulateNotification()

    const counter = screen.getByRole('status', {
      name: 'Counter of new documents created',
    })
    expect(counter).toHaveTextContent('2')
  })

  it('should clean up repository when component is disconnected', () => {
    const disconnectSpy = vi.spyOn(mockRepository, 'disconnect')

    notifications.remove()

    expect(disconnectSpy).toHaveBeenCalled()
  })
})
