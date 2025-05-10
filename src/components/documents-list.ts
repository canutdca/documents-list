import '../style.css'
import type { Document } from '../models/document.model'
import { DocumentsListElement } from './documents-list-element'
import { getDocuments } from '../repositories/get-documents.repository'

export class DocumentsList extends HTMLElement {
  private documents: Document[] = []

  constructor() {
    super()
  }

  async connectedCallback() {
    try {
      this.documents = await getDocuments()
      this.render()
    } catch (error) {
      console.error('Error to load documents:', error)
    }
  }

  private render() {
    this.innerHTML = `
      <article aria-label="List of documents" role="table">
        <header role="rowgroup" class="grid grid-cols-3 gap-4 px-6 mb-4 text-sm text-gray-600">
          <div role="columnheader">
            <span>Name</span>
          </div>
          <div role="columnheader">
            <span>Contributor</span>
          </div>
          <div role="columnheader">
            <span>Attachments</span>
          </div>
        </header>
        ${this.documents
          .map(
            () => `
          <documents-list-element></documents-list-element>
        `
          )
          .join('')}
      </article aria-label="List o">
    `

    // Asignar cada documento a su respectivo documents-list-element
    const elements = this.querySelectorAll('documents-list-element')
    elements.forEach((element, index) => {
      ;(element as DocumentsListElement).setDocument(this.documents[index])
    })
  }
}

customElements.define('documents-list', DocumentsList)
