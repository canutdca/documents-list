import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { DocumentsList } from './documents-list'
import { screen, within } from '@testing-library/dom'
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

  afterEach(() => {
    document.body.innerHTML = ''
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

  it('should render documents when documents attribute is set', () => {
    documentsList.setAttribute('documents', JSON.stringify(mockDocuments))
    const elements = document.querySelectorAll('documents-list-element')
    expect(elements).toHaveLength(mockDocuments.length)
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

    const elements = document.querySelectorAll('documents-list-element')
    expect(elements).toHaveLength(newDocuments.length)
  })

  it('should not update documents when attribute value is the same', () => {
    documentsList.setAttribute('documents', JSON.stringify(mockDocuments))
    const initialElements = document.querySelectorAll('documents-list-element')

    documentsList.setAttribute('documents', JSON.stringify(mockDocuments))

    const finalElements = document.querySelectorAll('documents-list-element')
    expect(finalElements).toHaveLength(initialElements.length)
  })
})
