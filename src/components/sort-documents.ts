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
      <div class="flex items-center gap-1" role="group" aria-labelledby="sort-label">
        <label id="sort-label" for="sort-select" class="text-sm text-gray-600">Sort by:</label>
        <select 
          id="sort-select"
          class="text-sm bg-transparent text-blue-500 focus:outline-none"
          aria-label="Select sorting criteria"
          aria-describedby="sort-description"
        >
          <option value="" disabled selected class="text-blue-500">Select one...</option>
          <option value="name" class="text-blue-500">Name</option>
          <option value="version" class="text-blue-500">Version</option>
          <option value="createdAt" class="text-blue-500">Creation date</option>
        </select>
        <span id="sort-description" class="sr-only">Choose how to sort the documents list</span>
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
