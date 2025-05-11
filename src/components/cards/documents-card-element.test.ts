import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { DocumentsCardElement } from './documents-card-element'
import { screen, within } from '@testing-library/dom'
import '@testing-library/jest-dom'
import type { Document } from '../../models/document.model'

describe('DocumentsCardElement', () => {
  let element: DocumentsCardElement
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
    element = new DocumentsCardElement()
    document.body.appendChild(element)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render the document card element', () => {
    expect(document.querySelector('documents-card-element')).toBeInTheDocument()
  })

  it('should render document details when setDocument is called', () => {
    element.setDocument(mockDocument)

    const card = screen.getByRole('article')
    const content = within(card)

    expect(content.getByText(mockDocument.name)).toBeInTheDocument()
    expect(
      content.getByText(`Version ${mockDocument.version}`)
    ).toBeInTheDocument()

    mockDocument.contributors.forEach((contributor) => {
      expect(content.getByText(contributor)).toBeInTheDocument()
    })

    mockDocument.attachments.forEach((attachment) => {
      expect(content.getByText(attachment)).toBeInTheDocument()
    })
    expect(screen.getByText('1 hour ago')).toBeInTheDocument()
  })

  it('should update document details when setDocument is called multiple times', () => {
    element.setDocument(mockDocument)

    const updatedDocument: Document = {
      ...mockDocument,
      name: 'Updated Document',
      version: '2.0',
      contributors: ['User 3'],
      attachments: ['file3.pdf'],
      createdAt: new Date('2024-03-20T12:30:00Z'),
    }

    element.setDocument(updatedDocument)

    const card = screen.getByRole('article')
    const content = within(card)

    expect(content.getByText(updatedDocument.name)).toBeInTheDocument()
    expect(
      content.getByText(`Version ${updatedDocument.version}`)
    ).toBeInTheDocument()
    expect(screen.getByText('30 minutes ago')).toBeInTheDocument()

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
