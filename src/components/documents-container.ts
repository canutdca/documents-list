import type { Document } from '../models/document.model'
import { getDocuments } from '../repositories/get-documents.repository'

interface ViewSelector extends HTMLElement {
  setView(view: 'list' | 'cards'): void
}

export class DocumentsContainer extends HTMLElement {
  private documents: Document[] = []
  private currentView: 'list' | 'cards' = 'list'
  private currentSort: string = ''

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
      <div class="flex justify-between items-center mb-6" role="toolbar" aria-label="Document view controls">
        <sort-documents></sort-documents>
        <view-selector></view-selector>
      </div>

      <div id="documents-content" class="mt-8" role="region">
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

    const sortDocuments = this.querySelector('sort-documents')
    if (sortDocuments) {
      sortDocuments.addEventListener('sortChange', ((event: CustomEvent) => {
        this.currentSort = event.detail
        this.sortDocuments()
        this.updateDocuments()
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

  private sortDocuments() {
    if (!this.currentSort) return

    this.documents.sort((a, b) => {
      let valueA: string | number | Date
      let valueB: string | number | Date

      switch (this.currentSort) {
        case 'name':
          valueA = a.name.toLowerCase()
          valueB = b.name.toLowerCase()
          break
        case 'version':
          valueA = a.version
          valueB = b.version
          break
        case 'createdAt':
          valueA = new Date(a.createdAt)
          valueB = new Date(b.createdAt)
          break
        default:
          return 0
      }
      return valueA < valueB ? -1 : 1
    })
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
