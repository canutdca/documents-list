import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { WebSocketNotificationsRepository } from './notifications.repository'

describe('WebSocketNotificationsRepository', () => {
  let repository: WebSocketNotificationsRepository
  let mockWebSocket: WebSocket
  let mockCallback: () => void

  beforeEach(() => {
    mockCallback = vi.fn()
    mockWebSocket = {
      onmessage: null,
      onerror: null,
      onclose: null,
      close: vi.fn(),
    } as unknown as WebSocket

    vi.stubGlobal(
      'WebSocket',
      vi.fn().mockImplementation(() => mockWebSocket)
    )
    repository = new WebSocketNotificationsRepository()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  it('should connect to WebSocket when registering a callback', () => {
    repository.onNewNotification(mockCallback)
    expect(WebSocket).toHaveBeenCalledWith('ws://localhost:8080/notifications')
  })

  it('should not create multiple WebSocket connections', () => {
    repository.onNewNotification(mockCallback)
    repository.onNewNotification(mockCallback)
    expect(WebSocket).toHaveBeenCalledTimes(1)
  })

  it('should call all registered callbacks when receiving a message', () => {
    const mockCallback2 = vi.fn()
    repository.onNewNotification(mockCallback)
    repository.onNewNotification(mockCallback2)

    mockWebSocket.onmessage!({} as MessageEvent)
    expect(mockCallback).toHaveBeenCalled()
    expect(mockCallback2).toHaveBeenCalled()
  })

  it('should log error when WebSocket encounters an error', () => {
    const consoleSpy = vi.spyOn(console, 'error')
    repository.onNewNotification(mockCallback)

    mockWebSocket.onerror!({} as Event)
    expect(consoleSpy).toHaveBeenCalledWith(
      'WebSocket error:',
      expect.any(Object)
    )
  })

  it('should log when WebSocket connection is closed', () => {
    const consoleSpy = vi.spyOn(console, 'log')
    repository.onNewNotification(mockCallback)

    mockWebSocket.onclose!({} as CloseEvent)
    expect(consoleSpy).toHaveBeenCalledWith('WebSocket connection closed')
  })

  it('should close WebSocket connection when disconnecting', () => {
    repository.onNewNotification(mockCallback)
    repository.disconnect()
    expect(mockWebSocket.close).toHaveBeenCalled()
  })
})
