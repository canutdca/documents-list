import type { Document } from '../models/document.model'

export class DocumentForm extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.render()
  }

  private render() {
    this.innerHTML = `
      <dialog 
        id="document-dialog" 
        class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg shadow-lg bg-white"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <header class="space-y-2 mb-4">
          <h2 id="dialog-title" class="text-lg font-semibold">Create New Document</h2>
          <p id="dialog-description" class="text-sm text-gray-600">
            Fill in the document details below. All fields marked with an asterisk (*) are required.
          </p>
        </header>

        <form id="document-form" class="space-y-4">
          <div>
            <label for="document-name" class="block text-sm font-medium text-gray-700 mb-1">
              Document Name <span class="text-red-500" aria-hidden="true">*</span>
            </label>
            <input 
              type="text" 
              id="document-name" 
              name="name" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-required="true"
            >
          </div>

          <div>
            <label for="document-version" class="block text-sm font-medium text-gray-700 mb-1">
              Version <span class="text-red-500" aria-hidden="true">*</span>
            </label>
            <input 
              type="text" 
              id="document-version" 
              name="version" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-required="true"
            >
          </div>

          <div class="space-y-2">
            <label for="contributors" class="block text-sm font-medium text-gray-700">Contributors</label>
            <div>
              <input 
                type="text" 
                id="contributors" 
                name="contributors"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <p class="text-xs text-gray-500">Separate multiple contributors with semicolons (;)</p>
            </div>
          </div>

          <div class="space-y-2">
            <label for="attachments" class="block text-sm font-medium text-gray-700">Attachments</label>
            <div>
              <input 
                type="text" 
                id="attachments" 
                name="attachments"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <p class="text-xs text-gray-500">Separate multiple attachments with semicolons (;)</p>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-6">
            <button 
              type="button"
              id="cancel-btn"
              class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              aria-label="Cancel document creation"
              onclick="this.closest('dialog').close()"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm"
              aria-label="Create document"
            >
              Create
            </button>
          </div>
        </form>
      </dialog>
    `
    this.setupEventListeners()
  }

  private setupEventListeners() {
    const dialog = this.querySelector('dialog')
    const form = this.querySelector('form')
    if (!dialog || !form) return

    form.addEventListener('submit', (event) => {
      event.preventDefault()

      const formData = new FormData(form)
      const name = formData.get('name') as string
      const version = formData.get('version') as string
      const contributors = ((formData.get('contributors') as string) || '')
        .split(';')
        .map((c) => c.trim())
        .filter((c) => c.length > 0)
      const attachments = ((formData.get('attachments') as string) || '')
        .split(';')
        .map((a) => a.trim())
        .filter((a) => a.length > 0)

      const newDocument: Document = {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        name,
        version,
        contributors,
        attachments,
      }

      const customEvent = new CustomEvent('documentCreated', {
        detail: { document: newDocument },
        bubbles: true,
        composed: true,
      })
      this.dispatchEvent(customEvent)

      dialog.close()
      form.reset()
    })
  }
}

customElements.define('document-form', DocumentForm)
