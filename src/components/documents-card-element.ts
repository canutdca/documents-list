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
      <article class="bg-white rounded-lg p-6 shadow-sm h-full">
        <div class="flex flex-col gap-4">
          <div>
            <h3 class="text-xl font-bold text-gray-900">${this.document.name}</h3>
            <span class="text-sm text-gray-600">v${this.document.version}</span>
          </div>
          
          <div>
            <h4 class="font-medium text-gray-700 mb-2">Contribuidores</h4>
            <div class="flex flex-wrap gap-2">
              ${this.document.contributors
                .map(
                  (c) => `
                <div class="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">${c}</div>
              `
                )
                .join('')}
            </div>
          </div>

          <div>
            <h4 class="font-medium text-gray-700 mb-2">Archivos adjuntos</h4>
            <div class="flex flex-wrap gap-2">
              ${this.document.attachments
                .map(
                  (a) => `
                <div class="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">${a}</div>
              `
                )
                .join('')}
            </div>
          </div>
        </div>
      </article>
    `
  }
}

customElements.define('documents-card-element', DocumentsCardElement)
