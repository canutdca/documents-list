import { describe, it, expect, beforeEach } from 'vitest'
import { NotificationsList } from './notifications-list'
import type { Notification } from '../../models/notification.model'
import { screen, within } from '@testing-library/dom'
import '@testing-library/jest-dom'

describe('NotificationsList', () => {
  let notificationsList: NotificationsList

  beforeEach(() => {
    notificationsList = new NotificationsList()
    document.body.appendChild(notificationsList)
  })

  it('should render the component correctly', () => {
    expect(document.querySelector('notifications-list')).toBeInTheDocument()
  })

  it('should show empty state when no notifications are present', () => {
    notificationsList.toggleModal()
    expect(screen.getByText('No notifications yet')).toBeInTheDocument()
  })

  it('should render notifications when they are present', () => {
    const mockNotifications: Notification[] = [
      { documentName: 'Test Document 1', createdBy: 'Test User 1' },
      { documentName: 'Test Document 2', createdBy: 'Test User 2' },
    ]

    notificationsList.setNotifications(mockNotifications)
    notificationsList.toggleModal()

    const list = screen.getByRole('list', { name: 'Notifications list' })
    expect(list).toBeInTheDocument()
    expect(list.children.length).toBe(2)
  })

  it('should toggle modal visibility', () => {
    const dialog = notificationsList.querySelector('dialog')
    expect(dialog).not.toHaveAttribute('open')

    notificationsList.toggleModal()
    expect(dialog).toHaveAttribute('open')

    notificationsList.toggleModal()
    expect(dialog).not.toHaveAttribute('open')
  })

  it('should update notifications list when new notifications are set', () => {
    const initialNotifications: Notification[] = [
      { documentName: 'Initial Document', createdBy: 'Initial User' },
    ]
    const updatedNotifications: Notification[] = [
      { documentName: 'Updated Document', createdBy: 'Updated User' },
    ]

    notificationsList.setNotifications(initialNotifications)
    notificationsList.toggleModal()
    expect(screen.getByText('Initial Document')).toBeInTheDocument()

    notificationsList.setNotifications(updatedNotifications)
    expect(screen.getByText('Updated Document')).toBeInTheDocument()
  })

  it('should close modal when clicking close button', () => {
    notificationsList.toggleModal()
    const dialog = notificationsList.querySelector('dialog')
    expect(dialog).toHaveAttribute('open')

    const closeButton = screen.getByRole('button', {
      name: 'Close notifications',
    })
    closeButton.click()
    expect(dialog).not.toHaveAttribute('open')
  })

  it('should have correct dialog attributes', () => {
    notificationsList.toggleModal()
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title')
    expect(dialog).toHaveAttribute('aria-describedby', 'dialog-description')
  })

  it('should have correct dialog title and description', () => {
    notificationsList.toggleModal()
    expect(
      screen.getByRole('heading', { name: 'Notifications' })
    ).toBeInTheDocument()
    expect(screen.getByText('List of document notifications')).toHaveClass(
      'sr-only'
    )
  })

  it('should update list elements with correct notification data', () => {
    const mockNotifications: Notification[] = [
      { documentName: 'Test Document 1', createdBy: 'Test User 1' },
      { documentName: 'Test Document 2', createdBy: 'Test User 2' },
    ]

    notificationsList.setNotifications(mockNotifications)
    notificationsList.toggleModal()

    const list = screen.getByRole('list', { name: 'Notifications list' })
    const items = within(list).getAllByRole('listitem')

    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('Test Document 1')
    expect(items[0]).toHaveTextContent('Test User 1')
    expect(items[1]).toHaveTextContent('Test Document 2')
    expect(items[1]).toHaveTextContent('Test User 2')
  })

  it('should handle empty notifications array', () => {
    notificationsList.setNotifications([])
    notificationsList.toggleModal()

    const list = screen.getByRole('list', { name: 'Notifications list' })
    expect(list).toHaveTextContent('No notifications yet')
    expect(list.children.length).toBe(1)
  })

  it('should update list elements when notifications change', () => {
    const initialNotifications: Notification[] = [
      { documentName: 'Initial Document', createdBy: 'Initial User' },
    ]
    const updatedNotifications: Notification[] = [
      { documentName: 'Updated Document', createdBy: 'Updated User' },
      { documentName: 'New Document', createdBy: 'New User' },
    ]

    notificationsList.setNotifications(initialNotifications)
    notificationsList.toggleModal()

    const list = screen.getByRole('list', { name: 'Notifications list' })
    expect(list.children.length).toBe(1)
    expect(list).toHaveTextContent('Initial Document')

    notificationsList.setNotifications(updatedNotifications)
    expect(list.children.length).toBe(2)
    expect(list).toHaveTextContent('Updated Document')
    expect(list).toHaveTextContent('New Document')
  })

  it('should update list elements with new notification data', () => {
    const mockNotifications: Notification[] = [
      { documentName: 'Test Document 1', createdBy: 'Test User 1' },
    ]

    notificationsList.setNotifications(mockNotifications)
    notificationsList.toggleModal()

    const list = screen.getByRole('list', { name: 'Notifications list' })
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent('Test Document 1')

    const updatedNotifications: Notification[] = [
      { documentName: 'Updated Document', createdBy: 'Updated User' },
    ]

    notificationsList.setNotifications(updatedNotifications)
    const updatedItems = within(list).getAllByRole('listitem')
    expect(updatedItems).toHaveLength(1)
    expect(updatedItems[0]).toHaveTextContent('Updated Document')
    expect(updatedItems[0]).toHaveTextContent('Updated User')
  })

  it('should handle multiple notification updates', () => {
    const notifications: Notification[] = [
      { documentName: 'Document 1', createdBy: 'User 1' },
      { documentName: 'Document 2', createdBy: 'User 2' },
    ]

    notificationsList.setNotifications(notifications)
    notificationsList.toggleModal()

    const list = screen.getByRole('list', { name: 'Notifications list' })
    let items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(2)

    notificationsList.setNotifications([notifications[0]])
    items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent('Document 1')

    const moreNotifications = [
      ...notifications,
      { documentName: 'Document 3', createdBy: 'User 3' },
    ]
    notificationsList.setNotifications(moreNotifications)
    items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(items[2]).toHaveTextContent('Document 3')
  })
})
