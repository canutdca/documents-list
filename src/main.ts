import './style.css'
import './components/documents-list'

const documentsListContainer =
  document.querySelector<HTMLDivElement>('#documents-list')
if (documentsListContainer) {
  documentsListContainer.innerHTML = '<documents-list></documents-list>'
}
