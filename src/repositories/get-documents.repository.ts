import type { Document } from '../models/document.model'

const documents: Document[] = [
  {
    id: 1,
    name: 'asd',
    version: 'asd',
    contributors: ['asd'],
    attachments: ['asd'],
  },
]
export async function getDocuments(): Promise<Document[]> {
  return Promise.resolve(documents)
}
