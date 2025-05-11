import type { Document } from '../../models/document.model'
import { DocumentsCardElement } from './documents-card-element'

export class DocumentsCards extends HTMLElement {
  private documents: Document[] = []

  static get observedAttributes() {
    return ['documents']
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'documents' && oldValue !== newValue) {
      this.documents = JSON.parse(newValue)
      this.render()
    }
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
        <li>
          <article aria-label="Add Document" class="bg-gray-50 rounded-lg p-6 shadow-sm h-full text-center hover:bg-blue-50 transition-colors"
            onclick="this.closest('documents-container').querySelector('document-form dialog').showModal()">
            <div class="flex flex-col gap-4 items-center justify-center h-full">
              <span class="text-base text-blue-500">+ Add Document</span>
            </div>
          </article>
        </li>
      </ul>
    `

    const elements = this.querySelectorAll('documents-card-element')
    elements.forEach((element, index) => {
      ;(element as DocumentsCardElement).setDocument(this.documents[index])
    })
  }
}

customElements.define('documents-cards', DocumentsCards)
