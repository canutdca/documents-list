import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SortDocuments } from './sort-documents'

describe('SortDocuments', () => {
  let sortDocuments: SortDocuments

  beforeEach(() => {
    sortDocuments = new SortDocuments()
    document.body.appendChild(sortDocuments)
  })

  it('should render the sort selector', () => {
    expect(document.querySelector('sort-documents')).not.toBeNull()
  })

  it('should render all sort options', () => {
    const options = document.querySelectorAll('option')
    expect(options.length).toBe(4)
    expect(options[0].textContent).toBe('Select one...')
    expect(options[1].textContent).toBe('Name')
    expect(options[2].textContent).toBe('Version')
    expect(options[3].textContent).toBe('Creation date')
  })

  it('should have "empty" as the default sort option', () => {
    const select = document.querySelector('select') as HTMLSelectElement
    expect(select.value).toBe('')
  })

  it('should emit sortChange event when changing sort option', () => {
    const select = document.querySelector('select') as HTMLSelectElement
    const eventSpy = vi.fn()
    sortDocuments.addEventListener('sortChange', eventSpy)
    select.value = 'version'
    select.dispatchEvent(new Event('change'))
    expect(eventSpy).toHaveBeenCalledWith(
      expect.objectContaining({ detail: 'version' })
    )
  })

  it('should update selected sort option when setSort is called', () => {
    sortDocuments.setSort('version')
    const select = document.querySelector('select') as HTMLSelectElement
    expect(select.value).toBe('version')
  })
})
