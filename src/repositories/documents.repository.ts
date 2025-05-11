import type { Document } from '../models/document.model'
import { config } from '../config/env'

export interface DocumentsRepository {
  getDocuments(): Promise<Document[]>
}

export class HttpDocumentsRepository implements DocumentsRepository {
  constructor(private readonly baseUrl: string = config.apiBaseUrl) {}

  async getDocuments(): Promise<Document[]> {
    return fetch(this.baseUrl + 'documents')
      .then((res) => res.json())
      .then((data: DocumentsResponse) =>
        data.map((doc: DocumentResponse) => ({
          id: doc.ID,
          createdAt: new Date(doc.CreatedAt),
          name: doc.Title,
          version: doc.Version,
          contributors: doc.Contributors.map((c) => c.Name),
          attachments: doc.Attachments,
        }))
      )
  }
}

type DocumentsResponse = DocumentResponse[]
interface DocumentResponse {
  ID: string
  CreatedAt: string
  Title: string
  Attachments: string[]
  Contributors: {
    ID: string
    Name: string
  }[]
  Version: string
}
