import type { Document } from '../models/document.model'

export async function getDocuments(): Promise<Document[]> {
  // TODO: error handling
  return fetch('http://localhost:8080/documents')
    .then((res) => res.json())
    .then((data: DocumentsResponse) =>
      data.map((doc: DocumentResponse) => ({
        id: doc.ID,
        name: doc.Title,
        version: doc.Version,
        contributors: doc.Contributors.map((c) => c.Name),
        attachments: doc.Attachments,
      }))
    )
}

type DocumentsResponse = DocumentResponse[]
interface DocumentResponse {
  ID: string
  Title: string
  Attachments: string[]
  Contributors: {
    ID: string
    Name: string
  }[]
  Version: string
}
