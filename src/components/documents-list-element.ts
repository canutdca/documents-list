import type { Document } from '../models/document.model'

export class DocumentsListElement extends HTMLElement {
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
      <article role="row" class="grid grid-cols-3 gap-4 bg-white rounded-sm p-6 mb-4 shadow-sm">
        <div role="cell">
          <h3 class="text-xl font-bold text-gray-900">${this.document.name}</h3>
          <span class="text-sm text-gray-600">v${this.document.version}</span>
        </div>
        <div role="cell">
          ${this.document.contributors
            .map((c) => `<div class="text-sm text-gray-600">${c}</div>`)
            .join('')}
        </div>
        <div role="cell">
          ${this.document.attachments
            .map((a) => `<div class="text-sm text-gray-600">${a}</div>`)
            .join('')}
        </div>
      </article>
    `
  }
}

customElements.define('documents-list-element', DocumentsListElement)
