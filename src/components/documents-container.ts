import type { Document } from '../models/document.model'
import type { DocumentForm } from './document-form'
import { getDocuments } from '../repositories/get-documents.repository'

interface ViewSelector extends HTMLElement {
  setView(view: 'list' | 'cards'): void
}

export class DocumentsContainer extends HTMLElement {
  private documents: Document[] = []
  private currentView: 'list' | 'cards' = 'list'

  constructor() {
    super()
  }

  async connectedCallback() {
    try {
      this.documents = await getDocuments()
      this.render()
      this.setupEventListeners()
    } catch (error) {
      console.error('Error to load documents:', error)
    }
  }

  private render() {
    this.innerHTML = `
      <view-selector></view-selector>
      <div id="documents-content" class="mt-8">
        ${this.currentView === 'list' ? '<documents-list></documents-list>' : '<documents-cards></documents-cards>'}
      </div>
      <document-form></document-form>
    `
    this.updateDocuments()
    this.updateViewSelector()
  }

  private setupEventListeners() {
    const viewSelector = this.querySelector('view-selector')
    if (viewSelector) {
      viewSelector.addEventListener('viewChange', ((event: CustomEvent) => {
        this.currentView = event.detail.view
        const content = this.querySelector('#documents-content')
        if (content) {
          content.innerHTML =
            this.currentView === 'list'
              ? '<documents-list></documents-list>'
              : '<documents-cards></documents-cards>'
          this.updateDocuments()
        }
      }) as EventListener)
    }

    const documentForm = this.querySelector('document-form')
    if (documentForm) {
      documentForm.addEventListener('documentCreated', ((
        event: CustomEvent
      ) => {
        this.documents = [...this.documents, event.detail.document]
        this.updateDocuments()
      }) as EventListener)
    }
  }

  private updateViewSelector() {
    const viewSelector = this.querySelector('view-selector') as ViewSelector
    if (viewSelector) {
      viewSelector.setView(this.currentView)
    }
  }

  private updateDocuments() {
    const content = this.querySelector('#documents-content')
    if (!content) return

    const currentComponent = content.firstElementChild
    if (!currentComponent) return

    if (this.currentView === 'list') {
      const listComponent = currentComponent as HTMLElement & {
        setDocuments: (docs: Document[]) => void
      }
      listComponent.setDocuments(this.documents)
    } else {
      const cardsComponent = currentComponent as HTMLElement & {
        setDocuments: (docs: Document[]) => void
      }
      cardsComponent.setDocuments(this.documents)
    }
  }
}

customElements.define('documents-container', DocumentsContainer)
