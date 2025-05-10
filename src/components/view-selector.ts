import { listIcon } from '../icons/list'
import { gridIcon } from '../icons/grid'

export class ViewSelector extends HTMLElement {
  private currentView: 'list' | 'cards' = 'list'

  constructor() {
    super()
  }

  connectedCallback() {
    this.render()
  }

  setView(view: 'list' | 'cards') {
    this.currentView = view
    this.updateButtons()
  }

  private updateButtons() {
    const listViewButton = this.querySelector('#list-view')
    const cardsViewButton = this.querySelector('#cards-view')

    if (!listViewButton || !cardsViewButton) return

    listViewButton.className = `p-2 rounded-md transition-colors duration-200 hover:bg-blue-600 ${this.currentView === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`
    cardsViewButton.className = `p-2 rounded-md transition-colors duration-200 hover:bg-blue-600 ${this.currentView === 'cards' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`
  }

  private render() {
    this.innerHTML = `
      <div class="mt-4 flex items-center gap-4">
        <div class="flex gap-2">
          <button 
            id="list-view" 
            class="p-2 rounded-md transition-colors duration-200 hover:bg-blue-600 ${this.currentView === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}"
            aria-pressed="${this.currentView === 'list'}"
          >
            ${listIcon}
          </button>
          <button 
            id="cards-view" 
            class="p-2 rounded-md transition-colors duration-200 hover:bg-blue-600 ${this.currentView === 'cards' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}"
            aria-pressed="${this.currentView === 'cards'}"
          >
            ${gridIcon}
          </button>
        </div>
      </div>
    `
    this.setupEventListeners()
  }

  private setupEventListeners() {
    const listViewButton = this.querySelector('#list-view')
    const cardsViewButton = this.querySelector('#cards-view')

    if (!listViewButton || !cardsViewButton) return

    listViewButton.addEventListener('click', () => {
      this.currentView = 'list'
      this.updateButtons()
      const event = new CustomEvent('viewChange', {
        detail: { view: 'list' },
        bubbles: true,
        composed: true,
      })
      this.dispatchEvent(event)
    })

    cardsViewButton.addEventListener('click', () => {
      this.currentView = 'cards'
      this.updateButtons()
      const event = new CustomEvent('viewChange', {
        detail: { view: 'cards' },
        bubbles: true,
        composed: true,
      })
      this.dispatchEvent(event)
    })
  }
}

customElements.define('view-selector', ViewSelector)
