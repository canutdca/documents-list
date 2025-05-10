import { bellIcon } from '../icons/bell'
import type { NotificationsRepository } from '../repositories/notifications.repository'
import { WebSocketNotificationsRepository } from '../repositories/notifications.repository'

export class Notifications extends HTMLElement {
  private count: number = 0
  private counterElement: HTMLElement | null = null
  private repository: NotificationsRepository

  constructor(
    repository: NotificationsRepository = new WebSocketNotificationsRepository()
  ) {
    super()
    this.repository = repository
  }

  connectedCallback() {
    this.render()
    this.setupNotifications()
  }

  disconnectedCallback() {
    this.repository.disconnect()
  }

  private render() {
    this.innerHTML = `
      <div class="fixed top-0 left-1/2 -translate-x-1/2 z-50 p-4 ${this.count === 0 ? 'hidden' : ''}">
        <div class="bg-white rounded-full px-3 py-1.5 text-xs text-gray-700 animate-fade-in flex items-center gap-2">
          <div class="relative">
            ${bellIcon}
            <span class="absolute -top-1 -right-1 bg-blue-500 text-white text-[8px] font-bold rounded-full w-3 h-3 flex items-center justify-center">${this.count}</span>
          </div>
          <span>New document added</span>
        </div>
      </div>
    `
    this.counterElement = this.querySelector('.absolute')
  }

  private updateCounter() {
    if (this.counterElement) {
      this.counterElement.textContent = this.count.toString()
    }
  }

  private setupNotifications() {
    this.repository.onNewNotification(() => {
      this.count++
      if (this.count === 1) {
        this.render()
      } else {
        this.updateCounter()
      }
    })
  }
}

customElements.define('notifications-component', Notifications)
