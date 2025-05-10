import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SortDocuments } from './sort-documents'
import { screen, within, fireEvent } from '@testing-library/dom'
import '@testing-library/jest-dom'

describe('SortDocuments', () => {
  let sortDocuments: SortDocuments

  beforeEach(() => {
    sortDocuments = new SortDocuments()
    document.body.appendChild(sortDocuments)
  })

  it('should render the sort selector', () => {
    expect(screen.getByRole('group', { name: 'Sort by:' })).toBeInTheDocument()
  })

  it('should render sort options', () => {
    const select = screen.getByRole('combobox', {
      name: 'Select sorting criteria',
    })
    const options = within(select).getAllByRole('option')

    expect(options).toHaveLength(4)
    expect(options[0]).toHaveTextContent('Select one...')
    expect(options[1]).toHaveTextContent('Name')
    expect(options[2]).toHaveTextContent('Version')
    expect(options[3]).toHaveTextContent('Creation date')
  })

  it('should have empty value as the default sort option', () => {
    const select = screen.getByRole('combobox', {
      name: 'Select sorting criteria',
    })
    expect(select).toHaveValue('')
  })

  it('should emit sortChange event when changing sort option', () => {
    const select = screen.getByRole('combobox', {
      name: 'Select sorting criteria',
    })
    const eventSpy = vi.fn()
    sortDocuments.addEventListener('sortChange', eventSpy)

    fireEvent.change(select, { target: { value: 'version' } })

    expect(eventSpy).toHaveBeenCalledWith(
      expect.objectContaining({ detail: 'version' })
    )
  })

  it('should update selected sort option when setSort is called', () => {
    sortDocuments.setSort('version')
    const select = screen.getByRole('combobox', {
      name: 'Select sorting criteria',
    })
    expect(select).toHaveValue('version')
  })
})
