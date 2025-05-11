import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { WebSocketNotificationsRepository } from './notifications.repository'
import type { Notification } from '../models/notification.model'

describe('WebSocketNotificationsRepository', () => {
  let repository: WebSocketNotificationsRepository
  let mockWebSocket: WebSocket
  let mockCallback: (notification: Notification) => void

  beforeEach(() => {
    mockWebSocket = {
      send: vi.fn(),
      close: vi.fn(),
      onmessage: null,
      onerror: null,
      onclose: null,
    } as unknown as WebSocket

    const MockWebSocket = vi
      .fn()
      .mockImplementation(() => mockWebSocket) as unknown as typeof WebSocket
    Object.defineProperties(MockWebSocket, {
      CONNECTING: { value: 0 },
      OPEN: { value: 1 },
      CLOSING: { value: 2 },
      CLOSED: { value: 3 },
    })
    global.WebSocket = MockWebSocket

    repository = new WebSocketNotificationsRepository('ws://test-url/')
    mockCallback = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should connect to WebSocket when registering callback', () => {
    repository.onNewNotification(mockCallback)
    expect(global.WebSocket).toHaveBeenCalledWith('ws://test-url/notifications')
  })

  it('should not create multiple WebSocket connections', () => {
    repository.onNewNotification(mockCallback)
    repository.onNewNotification(mockCallback)
    expect(global.WebSocket).toHaveBeenCalledTimes(1)
  })

  it('should handle incoming notifications', () => {
    repository.onNewNotification(mockCallback)

    const mockNotification = {
      DocumentTitle: 'Test Document',
      UserName: 'Test User',
    }

    const event = { data: JSON.stringify(mockNotification) }
    mockWebSocket.onmessage?.(event as MessageEvent)

    expect(mockCallback).toHaveBeenCalledWith({
      documentName: mockNotification.DocumentTitle,
      createdBy: mockNotification.UserName,
    })
  })

  it('should handle multiple callbacks', () => {
    const mockCallback2 = vi.fn()
    repository.onNewNotification(mockCallback)
    repository.onNewNotification(mockCallback2)

    const mockNotification = {
      DocumentTitle: 'Test Document',
      UserName: 'Test User',
    }

    const event = { data: JSON.stringify(mockNotification) }
    mockWebSocket.onmessage?.(event as MessageEvent)

    expect(mockCallback).toHaveBeenCalledWith({
      documentName: mockNotification.DocumentTitle,
      createdBy: mockNotification.UserName,
    })
    expect(mockCallback2).toHaveBeenCalledWith({
      documentName: mockNotification.DocumentTitle,
      createdBy: mockNotification.UserName,
    })
  })

  it('should handle WebSocket errors', () => {
    const consoleSpy = vi.spyOn(console, 'error')
    repository.onNewNotification(mockCallback)

    const mockError = new Event('error')
    mockWebSocket.onerror?.(mockError)

    expect(consoleSpy).toHaveBeenCalledWith('WebSocket error:', mockError)
  })

  it('should handle WebSocket close', () => {
    const consoleSpy = vi.spyOn(console, 'log')
    repository.onNewNotification(mockCallback)

    const mockCloseEvent = new CloseEvent('close')
    mockWebSocket.onclose?.(mockCloseEvent)

    expect(consoleSpy).toHaveBeenCalledWith('WebSocket connection closed')
  })

  it('should disconnect WebSocket', () => {
    repository.onNewNotification(mockCallback)
    repository.disconnect()

    expect(mockWebSocket.close).toHaveBeenCalled()
  })

  it('should handle disconnect when no connection exists', () => {
    repository.disconnect()
    expect(mockWebSocket.close).not.toHaveBeenCalled()
  })
})
