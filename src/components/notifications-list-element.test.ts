import { describe, it, expect, beforeEach } from 'vitest'
import { NotificationsListElement } from './notifications-list-element'
import type { Notification } from '../models/notification.model'
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom'

describe('NotificationsListElement', () => {
  let element: NotificationsListElement
  const mockNotification: Notification = {
    documentName: 'Test Document',
    createdBy: 'Test User',
  }

  beforeEach(() => {
    element = new NotificationsListElement()
    document.body.appendChild(element)
  })

  it('should render the component correctly', () => {
    expect(
      document.querySelector('notifications-list-element')
    ).toBeInTheDocument()
  })

  it('should render notification content correctly', () => {
    element.setNotification(mockNotification)

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      mockNotification.documentName
    )
    expect(screen.getByLabelText('Created by')).toHaveTextContent(
      `by ${mockNotification.createdBy}`
    )
  })

  it('should update content when notification changes', () => {
    const newNotification: Notification = {
      documentName: 'Updated Document',
      createdBy: 'Updated User',
    }

    element.setNotification(mockNotification)
    element.setNotification(newNotification)

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      newNotification.documentName
    )
    expect(screen.getByLabelText('Created by')).toHaveTextContent(
      `by ${newNotification.createdBy}`
    )
  })

  it('should maintain correct styling classes', () => {
    element.setNotification(mockNotification)

    const listItem = screen.getByRole('listitem')
    expect(listItem).toHaveClass('py-2', 'text-sm')

    const heading = screen.getByRole('heading', { level: 3 })
    expect(heading).toHaveClass('text-gray-900')

    const createdBy = screen.getByLabelText('Created by')
    expect(createdBy).toHaveClass('text-gray-500', 'text-xs')
  })
})
