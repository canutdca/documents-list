import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { DocumentsListElement } from './documents-list-element'
import { screen, within } from '@testing-library/dom'
import '@testing-library/jest-dom'
import type { Document } from '../../models/document.model'

describe('DocumentsListElement', () => {
  let element: DocumentsListElement
  const mockDocument: Document = {
    id: '1',
    name: 'Test Document',
    createdAt: new Date('2024-03-20T12:00:00Z'),
    version: '1.0',
    contributors: ['User 1', 'User 2'],
    attachments: ['file1.pdf', 'file2.pdf'],
  }

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-20T13:00:00Z'))
    element = new DocumentsListElement()
    document.body.appendChild(element)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render the document element', () => {
    expect(document.querySelector('documents-list-element')).toBeInTheDocument()
  })

  it('should render document details when setDocument is called', () => {
    element.setDocument(mockDocument)

    const row = screen.getByRole('row')
    const cells = within(row).getAllByRole('cell')

    expect(cells[0]).toHaveTextContent(mockDocument.name)
    expect(cells[0]).toHaveTextContent(`Version ${mockDocument.version}`)
    expect(cells[0]).toHaveTextContent('1 hour ago')

    mockDocument.contributors.forEach((contributor) => {
      expect(cells[1]).toHaveTextContent(contributor)
    })

    mockDocument.attachments.forEach((attachment) => {
      expect(cells[2]).toHaveTextContent(attachment)
    })
  })

  it('should update document details when setDocument is called multiple times', () => {
    element.setDocument(mockDocument)

    const updatedDocument: Document = {
      ...mockDocument,
      name: 'Updated Document',
      version: '2.0',
      createdAt: new Date('2024-03-20T12:30:00Z'),

      contributors: ['User 3'],
      attachments: ['file3.pdf'],
    }

    element.setDocument(updatedDocument)

    const row = screen.getByRole('row')
    const cells = within(row).getAllByRole('cell')

    expect(cells[0]).toHaveTextContent(updatedDocument.name)
    expect(cells[0]).toHaveTextContent(`Version ${updatedDocument.version}`)
    expect(cells[0]).toHaveTextContent('30 minutes ago')

    expect(cells[1]).toHaveTextContent(updatedDocument.contributors[0])
    expect(cells[1]).not.toHaveTextContent(mockDocument.contributors[0])

    expect(cells[2]).toHaveTextContent(updatedDocument.attachments[0])
    expect(cells[2]).not.toHaveTextContent(mockDocument.attachments[0])
  })
})
