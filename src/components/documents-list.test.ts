import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DocumentsList } from './documents-list'
import { screen, within, fireEvent } from '@testing-library/dom'
import '@testing-library/jest-dom'
import type { Document } from '../models/document.model'

describe('DocumentsList', () => {
  let documentsList: DocumentsList
  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'Document 1',
      createdAt: new Date(),
      version: '1.0',
      contributors: ['User 1'],
      attachments: ['file1.pdf'],
    },
    {
      id: '2',
      name: 'Document 2',
      createdAt: new Date(),
      version: '2.0',
      contributors: ['User 2'],
      attachments: ['file2.pdf'],
    },
  ]

  beforeEach(() => {
    documentsList = new DocumentsList()
    document.body.appendChild(documentsList)
  })

  it('should render the documents list', () => {
    expect(document.querySelector('documents-list')).toBeInTheDocument()
  })

  it('should render the table headers', () => {
    documentsList.setAttribute('documents', JSON.stringify(mockDocuments))
    const table = screen.getByRole('table', { name: 'List of documents' })
    const headers = within(table).getAllByRole('columnheader')

    expect(headers).toHaveLength(3)
    expect(headers[0]).toHaveTextContent('Name')
    expect(headers[1]).toHaveTextContent('Contributors')
    expect(headers[2]).toHaveTextContent('Attachments')
  })

  it('should render the add document button', () => {
    documentsList.setAttribute('documents', JSON.stringify(mockDocuments))
    const addButton = screen.getByRole('row', { name: '+ Add Document' })
    expect(addButton).toBeInTheDocument()
    expect(addButton).toHaveTextContent('+ Add Document')
  })

  it('should open modal when clicking add document button', () => {
    documentsList.setAttribute('documents', JSON.stringify(mockDocuments))
    const addButton = screen.getByRole('row', { name: '+ Add Document' })

    const mockShowModal = vi.fn()
    const mockDialog = { showModal: mockShowModal }

    const mockQuerySelector = vi.fn().mockReturnValue(mockDialog)
    const mockClosest = vi
      .fn()
      .mockReturnValue({ querySelector: mockQuerySelector })

    addButton.onclick = () => {
      const container = mockClosest()
      const dialog = container.querySelector('document-form dialog')
      dialog.showModal()
    }

    fireEvent.click(addButton)

    expect(mockClosest).toHaveBeenCalled()
    expect(mockQuerySelector).toHaveBeenCalledWith('document-form dialog')
    expect(mockShowModal).toHaveBeenCalled()
  })

  it('should render documents when documents attribute is set', () => {
    documentsList.setAttribute('documents', JSON.stringify(mockDocuments))
    const table = screen.getByRole('table', { name: 'List of documents' })
    const rows = within(table).getAllByRole('row')
    expect(rows).toHaveLength(mockDocuments.length + 2) // +1 for header, +1 for add button
  })

  it('should update documents when attribute changes', () => {
    documentsList.setAttribute('documents', JSON.stringify(mockDocuments))
    const newDocuments = [
      ...mockDocuments,
      {
        id: '3',
        name: 'Document 3',
        createdAt: new Date(),
        version: '3.0',
        contributors: ['User 3'],
        attachments: ['file3.pdf'],
      },
    ]

    documentsList.setAttribute('documents', JSON.stringify(newDocuments))

    const table = screen.getByRole('table', { name: 'List of documents' })
    const rows = within(table).getAllByRole('row')
    expect(rows).toHaveLength(newDocuments.length + 2) // +1 for header, +1 for add button
  })

  it('should not update documents when attribute value is the same', () => {
    documentsList.setAttribute('documents', JSON.stringify(mockDocuments))
    const table = screen.getByRole('table', { name: 'List of documents' })
    const initialRows = within(table).getAllByRole('row')

    documentsList.setAttribute('documents', JSON.stringify(mockDocuments))

    const finalRows = within(table).getAllByRole('row')
    expect(finalRows).toHaveLength(initialRows.length)
  })
})
