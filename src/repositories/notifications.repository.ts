export interface NotificationsRepository {
  onNewNotification(callback: () => void): void
  disconnect(): void
}

export class WebSocketNotificationsRepository
  implements NotificationsRepository
{
  private ws: WebSocket | null = null
  private callbacks: (() => void)[] = []

  constructor(private readonly baseUrl: string = 'ws://localhost:8080/') {}

  onNewNotification(callback: () => void): void {
    this.callbacks.push(callback)
    this.connect()
  }

  private connect(): void {
    if (this.ws) return

    this.ws = new WebSocket(this.baseUrl + 'notifications')

    this.ws.onmessage = () => {
      this.callbacks.forEach((callback) => callback())
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
