import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/dom'
import '@testing-library/jest-dom'
import { DocumentsContainer } from './documents-container'
import type { Document } from '../models/document.model'
import type { DocumentsRepository } from '../repositories/documents.repository'

class MockViewSelector extends HTMLElement {
  setView(): void {}
}

class MockDocumentsRepository implements DocumentsRepository {
  private documents: Document[] = []

  constructor(documents: Document[] = []) {
    this.documents = documents
  }

  async getDocuments(): Promise<Document[]> {
    return this.documents
  }

  setDocuments(newDocuments: Document[]): void {
    this.documents = newDocuments
  }
}

describe('DocumentsContainer', () => {
  let container: DocumentsContainer
  let mockRepository: MockDocumentsRepository
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

  beforeEach(async () => {
    if (!customElements.get('view-selector')) {
      customElements.define('view-selector', MockViewSelector)
    }
    mockRepository = new MockDocumentsRepository(mockDocuments)
    container = new DocumentsContainer(mockRepository)
    document.body.appendChild(container)
    await waitFor(() => {
      expect(document.querySelector('documents-container')).toBeInTheDocument()
    })
  })

  it('should render the documents-container element', () => {
    const element = document.querySelector('documents-container')
    expect(element).toBeInTheDocument()
  })

  it('should render the container correctly', () => {
    expect(
      screen.getByRole('region', { name: 'documents' })
    ).toBeInTheDocument()
  })

  it('should display the view selector', () => {
    expect(
      screen.getByRole('toolbar', { name: 'Document view controls' })
    ).toBeInTheDocument()
  })

  it('should display the sort selector', () => {
    expect(
      screen.getByRole('toolbar', { name: 'Document view controls' })
    ).toBeInTheDocument()
  })

  it('should display the documents content region', () => {
    expect(
      screen.getByRole('region', { name: 'documents' })
    ).toBeInTheDocument()
  })

  it('should display the documents list by default', () => {
    expect(document.querySelector('documents-list')).toBeInTheDocument()
  })
})
