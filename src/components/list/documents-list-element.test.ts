import { describe, it, expect, beforeEach } from 'vitest'
import { DocumentsListElement } from './documents-list-element'
import { screen, within } from '@testing-library/dom'
import '@testing-library/jest-dom'
import type { Document } from '../../models/document.model'

describe('DocumentsListElement', () => {
  let element: DocumentsListElement
  const mockDocument: Document = {
    id: '1',
    name: 'Test Document',
    createdAt: new Date(),
    version: '1.0',
    contributors: ['User 1', 'User 2'],
    attachments: ['file1.pdf', 'file2.pdf'],
  }

  beforeEach(() => {
    element = new DocumentsListElement()
    document.body.appendChild(element)
  })

  it('should render the document element', () => {
    expect(document.querySelector('documents-list-element')).toBeInTheDocument()
  })

  it('should render document details when setDocument is called', () => {
    element.setDocument(mockDocument)

    const row = screen.getByRole('row')
    const cells = within(row).getAllByRole('cell')

    expect(cells[0]).toHaveTextContent(mockDocument.name)
    expect(cells[0]).toHaveTextContent(`v${mockDocument.version}`)

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
      contributors: ['User 3'],
      attachments: ['file3.pdf'],
    }

    element.setDocument(updatedDocument)

    const row = screen.getByRole('row')
    const cells = within(row).getAllByRole('cell')

    expect(cells[0]).toHaveTextContent(updatedDocument.name)
    expect(cells[0]).toHaveTextContent(`v${updatedDocument.version}`)

    expect(cells[1]).toHaveTextContent(updatedDocument.contributors[0])
    expect(cells[1]).not.toHaveTextContent(mockDocument.contributors[0])

    expect(cells[2]).toHaveTextContent(updatedDocument.attachments[0])
    expect(cells[2]).not.toHaveTextContent(mockDocument.attachments[0])
  })
})
