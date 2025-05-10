import './style.css'
import './components/documents-list'
import './components/documents-cards'

const listViewButton = document.getElementById('list-view')
const cardsViewButton = document.getElementById('cards-view')
const container = document.getElementById('documents-container')

if (!listViewButton || !cardsViewButton || !container) {
  throw new Error('Required elements not found')
}

container.innerHTML = '<documents-list></documents-list>'

listViewButton.addEventListener('click', () => {
  listViewButton.classList.remove('bg-gray-200', 'text-gray-600')
  listViewButton.classList.add('bg-blue-500', 'text-white')
  listViewButton.setAttribute('aria-pressed', 'true')

  cardsViewButton.classList.remove('bg-blue-500', 'text-white')
  cardsViewButton.classList.add('bg-gray-200', 'text-gray-600')
  cardsViewButton.setAttribute('aria-pressed', 'false')

  container.innerHTML = '<documents-list></documents-list>'
})

cardsViewButton.addEventListener('click', () => {
  cardsViewButton.classList.remove('bg-gray-200', 'text-gray-600')
  cardsViewButton.classList.add('bg-blue-500', 'text-white')
  cardsViewButton.setAttribute('aria-pressed', 'true')

  listViewButton.classList.remove('bg-blue-500', 'text-white')
  listViewButton.classList.add('bg-gray-200', 'text-gray-600')
  listViewButton.setAttribute('aria-pressed', 'false')

  container.innerHTML = '<documents-cards></documents-cards>'
})
