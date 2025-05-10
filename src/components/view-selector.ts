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

  private render() {
    this.innerHTML = `
      <div class="mt-4 flex items-center gap-4">
        <span class="text-sm text-gray-600">Display:</span>
        <div class="flex gap-2">
          <button 
            id="list-view" 
            class="px-3 py-1 rounded-md ${this.currentView === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'} text-sm"
            aria-pressed="${this.currentView === 'list'}"
          >
            List
          </button>
          <button 
            id="cards-view" 
            class="px-3 py-1 rounded-md ${this.currentView === 'cards' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'} text-sm"
            aria-pressed="${this.currentView === 'cards'}"
          >
            Cards
          </button>
        </div>
      </div>
    `
    this.setupEventListeners()
  }

  private updateButtons() {
    const listViewButton = this.querySelector('#list-view')
    const cardsViewButton = this.querySelector('#cards-view')

    if (!listViewButton || !cardsViewButton) return

    listViewButton.className = `px-3 py-1 rounded-md ${this.currentView === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'} text-sm`
    listViewButton.setAttribute(
      'aria-pressed',
      String(this.currentView === 'list')
    )

    cardsViewButton.className = `px-3 py-1 rounded-md ${this.currentView === 'cards' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'} text-sm`
    cardsViewButton.setAttribute(
      'aria-pressed',
      String(this.currentView === 'cards')
    )
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
