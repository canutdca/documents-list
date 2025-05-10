import { listIcon } from '../icons/list'
import { gridIcon } from '../icons/grid'

export class ViewSelector extends HTMLElement {
  private currentView: 'list' | 'cards' = 'list'
  private readonly baseStyles =
    'p-2 rounded-md transition-colors duration-200 hover:bg-blue-600'

  constructor() {
    super()
  }

  connectedCallback() {
    this.render()
  }

  setView(view: 'list' | 'cards') {
    this.currentView = view
    this.updateView()
  }

  private updateView() {
    const listViewInput = this.querySelector('#list-view') as HTMLInputElement
    const cardsViewInput = this.querySelector('#cards-view') as HTMLInputElement

    if (!listViewInput?.parentElement || !cardsViewInput?.parentElement) return

    listViewInput.checked = this.currentView === 'list'
    cardsViewInput.checked = this.currentView === 'cards'

    listViewInput.parentElement.className = `${this.baseStyles} ${this.currentView === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`
    cardsViewInput.parentElement.className = `${this.baseStyles} ${this.currentView === 'cards' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`
  }

  private render() {
    this.innerHTML = `
      <div class="flex gap-2" role="radiogroup" aria-label="Select view type">
        <label>
          <input 
            type="radio" 
            id="list-view" 
            name="view" 
            value="list" 
            ${this.currentView === 'list' ? 'checked' : ''}
            class="hidden"
            aria-label="List view"
          />
          ${listIcon}
        </label>
        <label>
          <input 
            type="radio" 
            id="cards-view" 
            name="view" 
            value="cards"
            ${this.currentView === 'cards' ? 'checked' : ''}
            class="hidden" 
            aria-label="Cards view"
          />
          ${gridIcon}
        </label>
      </div>
    `
    this.setupEventListeners()
  }

  public setupEventListeners() {
    const listViewInput = this.querySelector('#list-view') as HTMLInputElement
    const cardsViewInput = this.querySelector('#cards-view') as HTMLInputElement

    if (!listViewInput || !cardsViewInput) return

    listViewInput.addEventListener('change', () => {
      this.currentView = 'list'
      this.updateView()
      const event = new CustomEvent('viewChange', {
        detail: 'view',
        bubbles: true,
        composed: true,
      })
      this.dispatchEvent(event)
    })

    cardsViewInput.addEventListener('change', () => {
      this.currentView = 'cards'
      this.updateView()
      const event = new CustomEvent('viewChange', {
        detail: 'cards',
        bubbles: true,
        composed: true,
      })
      this.dispatchEvent(event)
    })
  }
}

customElements.define('view-selector', ViewSelector)
