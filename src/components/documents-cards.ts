import type { Document } from '../models/document.model'
import { DocumentsCardElement } from './documents-card-element'

export class DocumentsCards extends HTMLElement {
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
      <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${this.documents
          .map(
            () => `
          <li>
            <documents-card-element></documents-card-element>
          </li>
        `
          )
          .join('')}
      </ul>
    `

    const elements = this.querySelectorAll('documents-card-element')
    elements.forEach((element, index) => {
      ;(element as DocumentsCardElement).setDocument(this.documents[index])
    })
  }
}

customElements.define('documents-cards', DocumentsCards)
