export class SortDocuments extends HTMLElement {
  private currentSort: string = ''

  constructor() {
    super()
  }

  connectedCallback() {
    this.render()
  }

  setSort(sort: string) {
    this.currentSort = sort
    this.updateSelect()
  }

  private updateSelect() {
    const select = this.querySelector('select')
    if (!select) return
    select.value = this.currentSort
  }

  private render() {
    this.innerHTML = `
      <div class="flex items-center gap-1">
        <span class="text-sm text-gray-600">Sort by:</span>
        <select 
          class="text-sm bg-transparent text-blue-500 focus:outline-none"
        >
          <option value="" disabled selected class="text-blue-500">Select one...</option>
          <option value="name" class="text-blue-500">Name</option>
          <option value="version" class="text-blue-500">Version</option>
          <option value="createdAt" class="text-blue-500">Creation date</option>
        </select>
      </div>
    `
    this.setupEventListeners()
  }

  private setupEventListeners() {
    const select = this.querySelector('select')
    if (!select) return

    select.addEventListener('change', (event) => {
      const target = event.target as HTMLSelectElement
      this.currentSort = target.value
      const customEvent = new CustomEvent('sortChange', {
        detail: this.currentSort,
        bubbles: true,
        composed: true,
      })
      this.dispatchEvent(customEvent)
    })
  }
}

customElements.define('sort-documents', SortDocuments)
