import { describe, it, expect, beforeEach } from 'vitest'
import { DocumentsCardElement } from './documents-card-element'
import { screen, within } from '@testing-library/dom'
import '@testing-library/jest-dom'
import type { Document } from '../../models/document.model'

describe('DocumentsCardElement', () => {
  let element: DocumentsCardElement
  const mockDocument: Document = {
    id: '1',
    name: 'Test Document',
    createdAt: new Date(),
    version: '1.0',
    contributors: ['User 1', 'User 2'],
    attachments: ['file1.pdf', 'file2.pdf'],
  }

  beforeEach(() => {
    element = new DocumentsCardElement()
    document.body.appendChild(element)
  })

  it('should render the document card element', () => {
    expect(document.querySelector('documents-card-element')).toBeInTheDocument()
  })

  it('should render document details when setDocument is called', () => {
    element.setDocument(mockDocument)

    const card = screen.getByRole('article')
    const content = within(card)

    expect(content.getByText(mockDocument.name)).toBeInTheDocument()
    expect(content.getByText(`v${mockDocument.version}`)).toBeInTheDocument()

    mockDocument.contributors.forEach((contributor) => {
      expect(content.getByText(contributor)).toBeInTheDocument()
    })

    mockDocument.attachments.forEach((attachment) => {
      expect(content.getByText(attachment)).toBeInTheDocument()
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

    const card = screen.getByRole('article')
    const content = within(card)

    expect(content.getByText(updatedDocument.name)).toBeInTheDocument()
    expect(content.getByText(`v${updatedDocument.version}`)).toBeInTheDocument()

    expect(
      content.getByText(updatedDocument.contributors[0])
    ).toBeInTheDocument()
    mockDocument.contributors.forEach((contributor) => {
      expect(content.queryByText(contributor)).not.toBeInTheDocument()
    })

    expect(
      content.getByText(updatedDocument.attachments[0])
    ).toBeInTheDocument()
    mockDocument.attachments.forEach((attachment) => {
      expect(content.queryByText(attachment)).not.toBeInTheDocument()
    })
  })
})
