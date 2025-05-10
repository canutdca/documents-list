import type { Document } from '../models/document.model'
import {
  HttpDocumentsRepository,
  type DocumentsRepository,
} from '../repositories/documents.repository'

interface ViewSelector extends HTMLElement {
  setView(view: 'list' | 'cards'): void
}

export class DocumentsContainer extends HTMLElement {
  private documents: Document[] = []
  private currentView: 'list' | 'cards' = 'list'
  private currentSort: string = ''

  constructor(
    private documentsRepository: DocumentsRepository = new HttpDocumentsRepository()
  ) {
    super()
  }

  async connectedCallback() {
    try {
      this.documents = await this.documentsRepository.getDocuments()
      this.render()
      this.setupEventListeners()
    } catch (error) {
      console.error('Error to load documents:', error)
    }
  }

  private getDocumentsToJson() {
    return JSON.stringify(this.documents)
  }

  private getView(): string {
    return this.currentView === 'list'
      ? `<documents-list documents='${this.getDocumentsToJson()}'></documents-list>`
      : `<documents-cards documents='${this.getDocumentsToJson()}'></documents-cards>`
  }
  private render() {
    this.innerHTML = `     
      <div class="flex justify-between items-center mb-6" role="toolbar" aria-label="Document view controls">
        <sort-documents></sort-documents>
        <view-selector></view-selector>
      </div>

      <div id="documents-content" class="mt-8" role="region" aria-label="documents">
        ${this.getView()}
      </div>
      <document-form></document-form>
    `
    this.updateViewSelector()
  }

  private setupEventListeners() {
    const viewSelector = this.querySelector('view-selector')
    if (viewSelector) {
      viewSelector.addEventListener('viewChange', ((event: CustomEvent) => {
        this.currentView = event.detail
        const content = this.querySelector('#documents-content')
        if (content) {
          content.innerHTML = this.getView()
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

  private updateDocuments() {
    const content = this.querySelector('#documents-content')
    if (!content) return

    const currentComponent = content.firstElementChild
    if (!currentComponent) return

    if (this.currentView === 'list') {
      currentComponent.setAttribute('documents', JSON.stringify(this.documents))
    } else {
      currentComponent.setAttribute('documents', JSON.stringify(this.documents))
    }
  }

  private updateViewSelector() {
    const viewSelector = this.querySelector('view-selector') as ViewSelector
    if (viewSelector) {
      viewSelector.setView(this.currentView)
    }
  }
}

customElements.define('documents-container', DocumentsContainer)
