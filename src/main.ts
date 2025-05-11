import './style.css'
import './components/documents-container'
import './components/list/documents-list'
import './components/cards/documents-cards'
import './components/toolbar/view-selector'
import './components/document-form'
import './components/notifications/notifications-button'
import './components/notifications/notifications-list'
import './components/notifications/notifications-list-element'
import './components/toolbar/sort-documents'

const container = document.getElementById('documents-container')

if (!container) {
  throw new Error('Required elements not found')
}

container.innerHTML = '<documents-container></documents-container>'
