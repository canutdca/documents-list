import { bellIcon } from '../icons/bell'
import type { NotificationsRepository } from '../repositories/notifications.repository'
import { WebSocketNotificationsRepository } from '../repositories/notifications.repository'
import type { Notification } from '../models/notification.model'
import { NotificationsList } from './notifications-list'

export class NotificationsButton extends HTMLElement {
  private count: number = 0
  private counterElement: HTMLElement | null = null
  private repository: NotificationsRepository
  private notifications: Notification[] = []

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
      <div 
        role="status" 
        aria-live="polite" 
        aria-label="New documents created alert" 
        class="fixed top-0 left-1/2 -translate-x-1/2 z-50 p-4 ${this.count === 0 ? 'hidden' : ''}"
      >
        <button 
          class="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          onclick="this.closest('notifications-button').toggleModal()"
          aria-label="Open notifications"
          aria-haspopup="dialog"
        >
          <div class="relative">
            ${bellIcon}
            <span 
              role="status" 
              aria-live="polite" 
              aria-label="Counter of new documents created" 
              class="absolute -top-1 -right-1 bg-blue-500 text-white text-[8px] font-bold rounded-full w-3 h-3 flex items-center justify-center"
            >
              ${this.count}
            </span>
          </div>
          <span>New document added</span>
        </button>
      </div>
    `
    this.counterElement = this.querySelector('.absolute')
    this.updateList()
  }

  toggleModal() {
    const list = document.querySelector('notifications-list')
    if (list) {
      ;(list as NotificationsList).toggleModal()
    }
  }

  private updateCounter() {
    if (this.counterElement) {
      this.counterElement.textContent = this.count.toString()
    }
  }

  private updateList() {
    const list = document.querySelector('notifications-list')
    if (list) {
      ;(list as NotificationsList).setNotifications(this.notifications)
    }
  }

  private setupNotifications() {
    this.repository.onNewNotification((notification) => {
      this.count++
      this.notifications.push(notification)
      if (this.count === 1) {
        this.render()
      } else {
        this.updateCounter()
        this.updateList()
      }
    })
  }
}

customElements.define('notifications-button', NotificationsButton)
