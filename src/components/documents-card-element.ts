import type { Document } from '../models/document.model'

export class DocumentsCardElement extends HTMLElement {
  private document!: Document

  constructor() {
    super()
  }

  setDocument(doc: Document) {
    this.document = doc
    this.render()
  }

  private render() {
    this.innerHTML = `
      <article class="bg-white rounded-lg p-6 shadow-sm h-full text-center">
        <div class="flex flex-col gap-4">
          <div>
            <h3 class="text-xl font-bold text-gray-900">${this.document.name}</h3>
            <span class="text-sm text-gray-600">v${this.document.version}</span>
          </div>
          
          <div>
            <div>
              ${this.document.contributors
                .map((c) => `<div class="text-sm text-gray-600">${c}</div>`)
                .join('')}
            </div>
          </div>

          <div>
            <div>
              ${this.document.attachments
                .map((a) => `<div class="text-sm text-gray-600">${a}</div>`)
                .join('')}
            </div>
          </div>
        </div>
      </article>
    `
  }
}

customElements.define('documents-card-element', DocumentsCardElement)
