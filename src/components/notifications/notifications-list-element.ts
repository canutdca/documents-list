import type { Notification } from '../../models/notification.model'

export class NotificationsListElement extends HTMLElement {
  private notification!: Notification

  constructor() {
    super()
  }

  setNotification(notification: Notification) {
    this.notification = notification
    this.render()
  }

  private render() {
    this.innerHTML = `
      <div class="py-2 text-sm" role="listitem">
        <p class="text-gray-900" role="heading" aria-level="3">${this.notification.documentName}</p>
        <p class="text-gray-500 text-xs" aria-label="Created by">by ${this.notification.createdBy}</p>
      </div>
    `
  }
}

customElements.define('notifications-list-element', NotificationsListElement)
