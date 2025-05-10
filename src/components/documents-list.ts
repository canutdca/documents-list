import '../style.css'
import type { Document } from '../models/document.model'
import { DocumentsListElement } from './documents-list-element'

export class DocumentsList extends HTMLElement {
  private documents: Document[] = []

  constructor() {
    super()
  }

  setDocuments(docs: Document[]) {
    this.documents = docs
    this.render()
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
      </article>
    `

    const elements = this.querySelectorAll('documents-list-element')
    elements.forEach((element, index) => {
      ;(element as DocumentsListElement).setDocument(this.documents[index])
    })
  }
}

customElements.define('documents-list', DocumentsList)
