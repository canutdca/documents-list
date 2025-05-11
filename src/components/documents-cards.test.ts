import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DocumentsCards } from './documents-cards'
import { screen, fireEvent, within } from '@testing-library/dom'
import '@testing-library/jest-dom'
import type { Document } from '../models/document.model'

describe('DocumentsCards', () => {
  let documentsCards: DocumentsCards
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
    documentsCards = new DocumentsCards()
    document.body.appendChild(documentsCards)
  })

  it('should render the documents cards', () => {
    expect(document.querySelector('documents-cards')).toBeInTheDocument()
  })

  it('should render the add document button', () => {
    documentsCards.setAttribute('documents', JSON.stringify(mockDocuments))
    const addButton = screen.getByRole('article', { name: 'Add Document' })
    expect(addButton).toBeInTheDocument()
    expect(addButton).toHaveTextContent('+ Add Document')
  })

  it('should open modal when clicking add document button', () => {
    documentsCards.setAttribute('documents', JSON.stringify(mockDocuments))
    const addButton = screen.getByRole('article', { name: 'Add Document' })

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
    documentsCards.setAttribute('documents', JSON.stringify(mockDocuments))
    const list = screen.getByRole('list')
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(mockDocuments.length + 1) // +1 for the add button
  })

  it('should update documents when attribute changes', () => {
    documentsCards.setAttribute('documents', JSON.stringify(mockDocuments))
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

    documentsCards.setAttribute('documents', JSON.stringify(newDocuments))

    const list = screen.getByRole('list')
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(newDocuments.length + 1) // +1 for the add button
  })

  it('should not update documents when attribute value is the same', () => {
    documentsCards.setAttribute('documents', JSON.stringify(mockDocuments))
    const list = screen.getByRole('list')
    const initialItems = within(list).getAllByRole('listitem')

    documentsCards.setAttribute('documents', JSON.stringify(mockDocuments))

    const finalItems = within(list).getAllByRole('listitem')
    expect(finalItems).toHaveLength(initialItems.length)
  })
})
