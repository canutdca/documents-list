import '../style.css'

export class DocumentsList extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <div class="p-4">
        <h2 class="text-xl font-bold mb-4">Lista de Documentos</h2>
      </div>
    `
  }
}

customElements.define('documents-list', DocumentsList)
