import './style.css'
import './components/documents-container'
import './components/documents-list'
import './components/documents-cards'
import './components/view-selector'
import './components/document-form'
import './components/notifications-button'
import './components/notifications-list'
import './components/notifications-list-element'
import './components/sort-documents'

const container = document.getElementById('documents-container')

if (!container) {
  throw new Error('Required elements not found')
}

container.innerHTML = '<documents-container></documents-container>'
