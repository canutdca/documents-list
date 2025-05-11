import type { Notification } from '../models/notification.model'

export interface NotificationsRepository {
  onNewNotification(callback: (notification: Notification) => void): void
  disconnect(): void
}

export class WebSocketNotificationsRepository
  implements NotificationsRepository
{
  private ws: WebSocket | null = null
  private callbacks: ((notification: Notification) => void)[] = []

  constructor(private readonly baseUrl: string = 'ws://localhost:8080/') {}

  onNewNotification(callback: (notification: Notification) => void): void {
    this.callbacks.push(callback)
    this.connect()
  }

  private connect(): void {
    if (this.ws) return

    this.ws = new WebSocket(this.baseUrl + 'notifications')

    this.ws.onmessage = (event) => {
      const notifications: NotificationResponse = JSON.parse(event.data)
      this.callbacks.forEach((callback) =>
        callback({
          documentName: notifications.DocumentTitle,
          createdBy: notifications.UserName,
        })
      )
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    this.ws.onclose = () => {
      console.log('WebSocket connection closed')
      this.ws = null
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

interface NotificationResponse {
  DocumentTitle: string
  UserName: string
}
