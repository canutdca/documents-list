import type { Notification } from '../../models/notification.model'
import { NotificationsListElement } from './notifications-list-element'

export class NotificationsList extends HTMLElement {
  private notifications: Notification[] = []

  constructor() {
    super()
  }

  connectedCallback() {
    this.render()
  }

  setNotifications(notifications: Notification[]) {
    this.notifications = notifications
    this.updateList()
  }

  toggleModal() {
    const dialog = this.querySelector('dialog')
    if (dialog) {
      if (dialog.open) {
        dialog.close()
      } else {
        dialog.showModal()
      }
    }
  }

  private updateList() {
    const listContainer = this.querySelector('ul')
    if (listContainer) {
      listContainer.innerHTML =
        this.notifications.length === 0
          ? '<p class="py-2 text-sm text-gray-500" role="status">No notifications yet</p>'
          : this.notifications
              .map(
                () => `
            <notifications-list-element></notifications-list-element>
          `
              )
              .join('')

      const elements = listContainer.querySelectorAll(
        'notifications-list-element'
      )
      elements.forEach((element, index) => {
        ;(element as NotificationsListElement).setNotification(
          this.notifications[index]
        )
      })
    }
  }

  private render() {
    this.innerHTML = `
      <dialog 
        class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg shadow-lg bg-white w-[80%] max-h-[80vh]"
        role="dialog"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <header class="p-4 border-b">
          <div class="flex justify-between items-center">
            <h2 id="dialog-title" class="text-lg font-semibold">Notifications</h2>
            <button 
              class="text-gray-500 hover:text-gray-700"
              onclick="this.closest('dialog').close()"
              aria-label="Close notifications"
            >
              ✕
            </button>
          </div>
        </header>
        <div class="overflow-y-auto max-h-[calc(80vh-4rem)]">
          <div id="dialog-description" class="sr-only">List of document notifications</div>
          <ul class="divide-y" role="list" aria-label="Notifications list" data-testid="notifications-list">
            ${
              this.notifications.length === 0
                ? '<p class="py-2 text-sm text-gray-500">No notifications yet</p>'
                : this.notifications
                    .map(
                      () => `
                <notifications-list-element></notifications-list-element>
              `
                    )
                    .join('')
            }
          </ul>
        </div>
      </dialog>
    `

    const elements = this.querySelectorAll('notifications-list-element')
    elements.forEach((element, index) => {
      ;(element as NotificationsListElement).setNotification(
        this.notifications[index]
      )
    })
  }
}

customElements.define('notifications-list', NotificationsList)
