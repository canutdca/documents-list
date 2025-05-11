import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { HttpDocumentsRepository } from './documents.repository'

describe('HttpDocumentsRepository', () => {
  let repository: HttpDocumentsRepository
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)
    repository = new HttpDocumentsRepository()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  it('should fetch documents from the correct URL', async () => {
    const mockResponse = {
      json: vi.fn().mockResolvedValue([]),
      ok: true,
      status: 200,
      headers: new Headers(),
    } as unknown as Response

    mockFetch.mockResolvedValue(mockResponse)

    await repository.getDocuments()
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/documents')
  })

  it('should transform API response to Document model', async () => {
    const mockApiResponse = [
      {
        ID: '1',
        CreatedAt: '2024-03-20T10:00:00Z',
        Title: 'Test Document',
        Version: '1.0',
        Contributors: [
          { ID: '1', Name: 'User 1' },
          { ID: '2', Name: 'User 2' },
        ],
        Attachments: ['file1.pdf', 'file2.pdf'],
      },
    ]

    const mockResponse = {
      json: vi.fn().mockResolvedValue(mockApiResponse),
      ok: true,
      status: 200,
      headers: new Headers(),
    } as unknown as Response

    mockFetch.mockResolvedValue(mockResponse)

    const documents = await repository.getDocuments()

    expect(documents).toHaveLength(1)
    expect(documents[0]).toEqual({
      id: '1',
      createdAt: new Date('2024-03-20T10:00:00Z'),
      name: 'Test Document',
      version: '1.0',
      contributors: ['User 1', 'User 2'],
      attachments: ['file1.pdf', 'file2.pdf'],
    })
  })

  it('should handle empty response', async () => {
    const mockResponse = {
      json: vi.fn().mockResolvedValue([]),
      ok: true,
      status: 200,
      headers: new Headers(),
    } as unknown as Response

    mockFetch.mockResolvedValue(mockResponse)

    const documents = await repository.getDocuments()
    expect(documents).toEqual([])
  })

  it('should handle API error', async () => {
    mockFetch.mockRejectedValue(new Error('API Error'))

    await expect(repository.getDocuments()).rejects.toThrow('API Error')
  })
})
