import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NotificationsButton } from './notifications-button'
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom'
import type { NotificationsRepository } from '../repositories/notifications.repository'
import type { Notification } from '../models/notification.model'
import { NotificationsList } from './notifications-list'

class MockNotificationsRepository implements NotificationsRepository {
  private callback: ((notification: Notification) => void) | null = null

  onNewNotification(callback: (notification: Notification) => void): void {
    this.callback = callback
  }

  disconnect(): void {
    this.callback = null
  }

  simulateNotification(notification: Notification): void {
    if (this.callback) {
      this.callback(notification)
    }
  }
}

describe('NotificationsButton', () => {
  let notifications: NotificationsButton
  let mockRepository: MockNotificationsRepository

  beforeEach(() => {
    mockRepository = new MockNotificationsRepository()
    notifications = new NotificationsButton(mockRepository)
    document.body.appendChild(notifications)
    if (!document.querySelector('notifications-list')) {
      const list = new NotificationsList()
      document.body.appendChild(list)
    }
  })

  it('should render the component correctly', () => {
    expect(document.querySelector('notifications-button')).toBeInTheDocument()
  })

  it('should show notification alert when notification is received', () => {
    const mockNotification: Notification = {
      documentName: 'Test Document',
      createdBy: 'Test User',
    }
    mockRepository.simulateNotification(mockNotification)
    expect(
      screen.getByRole('status', { name: 'New documents created alert' })
    ).not.toHaveClass('hidden')
  })

  it('should hide notification alert when no notifications', () => {
    expect(
      screen.getByRole('status', { name: 'New documents created alert' })
    ).toHaveClass('hidden')
  })

  it('should have correct button attributes', () => {
    const button = screen.getByRole('button', { name: 'Open notifications' })
    expect(button).toHaveAttribute('aria-haspopup', 'dialog')
  })

  it('should increment counter when receiving notifications', () => {
    const mockNotification: Notification = {
      documentName: 'Test Document',
      createdBy: 'Test User',
    }

    mockRepository.simulateNotification(mockNotification)
    expect(
      screen.getByRole('status', { name: 'Counter of new documents created' })
    ).toHaveTextContent('1')

    mockRepository.simulateNotification(mockNotification)
    expect(
      screen.getByRole('status', { name: 'Counter of new documents created' })
    ).toHaveTextContent('2')
  })

  it('should update notifications list when receiving notifications', () => {
    const mockNotification: Notification = {
      documentName: 'Test Document',
      createdBy: 'Test User',
    }

    mockRepository.simulateNotification(mockNotification)
    const list = document.querySelector('notifications-list')
    expect(list).toBeInTheDocument()
  })

  it('should clean up repository when component is disconnected', () => {
    const disconnectSpy = vi.spyOn(mockRepository, 'disconnect')
    notifications.remove()
    expect(disconnectSpy).toHaveBeenCalled()
  })

  it('should toggle notifications list when clicking button', () => {
    const button = screen.getByRole('button', { name: 'Open notifications' })
    const list = document.querySelector(
      'notifications-list'
    ) as NotificationsList
    const toggleSpy = vi.spyOn(list, 'toggleModal')

    button.click()
    expect(toggleSpy).toHaveBeenCalled()
  })
})
