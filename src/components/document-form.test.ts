import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DocumentForm } from './document-form'
import { screen, within, fireEvent } from '@testing-library/dom'
import '@testing-library/jest-dom'

describe('DocumentForm', () => {
  let form: DocumentForm

  beforeEach(() => {
    form = new DocumentForm()
    document.body.appendChild(form)
  })

  it('should render the document form', () => {
    expect(document.querySelector('document-form')).toBeInTheDocument()
  })

  it('should be hidden', () => {
    expect(screen.getByRole('dialog', { hidden: true })).toBeInTheDocument()
  })

  it('should render the dialog with correct title and description', () => {
    openDialog()
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title')
    expect(dialog).toHaveAttribute('aria-describedby', 'dialog-description')

    const title = screen.getByText('Create New Document')
    const description = screen.getByText(/Fill in the document details below/)
    expect(title).toBeInTheDocument()
    expect(description).toBeInTheDocument()
  })

  it('should render all form fields with correct labels', () => {
    openDialog()
    const dialog = screen.getByRole('dialog')
    const formElement = dialog.querySelector('form')
    expect(formElement).toBeInTheDocument()
    const content = within(formElement!)

    expect(content.getByLabelText(/Document Name/)).toBeRequired()
    expect(content.getByLabelText(/Version/)).toBeRequired()

    expect(content.getByLabelText(/Contributors/)).not.toBeRequired()
    expect(content.getByLabelText(/Attachments/)).not.toBeRequired()

    expect(
      content.getByText(/Separate multiple contributors with semicolons/)
    ).toBeInTheDocument()
    expect(
      content.getByText(/Separate multiple attachments with semicolons/)
    ).toBeInTheDocument()
  })

  it('should render action buttons', () => {
    openDialog()
    const dialog = screen.getByRole('dialog')
    const formElement = dialog.querySelector('form')
    expect(formElement).toBeInTheDocument()
    const content = within(formElement!)

    expect(content.getByRole('button', { name: /Cancel/ })).toBeInTheDocument()
    expect(content.getByRole('button', { name: /Create/ })).toBeInTheDocument()
  })

  it('should close dialog when cancel button is clicked', () => {
    openDialog()
    const dialog = screen.getByRole('dialog')
    const cancelButton = dialog.querySelector(
      'button[aria-label="Cancel document creation"]'
    )
    expect(cancelButton).toBeInTheDocument()

    const mockClose = vi.fn()
    Object.defineProperty(dialog, 'close', { value: mockClose })

    fireEvent.click(cancelButton!)
    expect(mockClose).toHaveBeenCalled()
    expect(screen.getByRole('dialog', { hidden: true })).toBeInTheDocument()
  })

  it('should handle empty optional fields', () => {
    openDialog()
    const dialog = screen.getByRole('dialog')
    const formElement = dialog.querySelector('form')
    expect(formElement).toBeInTheDocument()

    const mockClose = vi.fn()
    Object.defineProperty(dialog, 'close', { value: mockClose })

    const mockDispatchEvent = vi.fn()
    document.addEventListener('documentCreated', mockDispatchEvent)

    fireEvent.change(screen.getByLabelText(/Document Name/), {
      target: { value: 'Test Document' },
    })
    fireEvent.change(screen.getByLabelText(/Version/), {
      target: { value: '1.0' },
    })

    fireEvent.submit(formElement!)

    expect(mockDispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'documentCreated',
        detail: expect.objectContaining({
          document: expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            version: expect.any(String),
            createdAt: expect.any(Date),
            contributors: [],
            attachments: [],
          }),
        }),
      })
    )

    expect(mockClose).toHaveBeenCalled()
    expect(screen.getByLabelText(/Document Name/)).toHaveValue('')
    expect(screen.getByLabelText(/Version/)).toHaveValue('')
  })

  it('should create and dispatch document event when form is submitted', () => {
    openDialog()
    const dialog = screen.getByRole('dialog')
    const formElement = dialog.querySelector('form')
    expect(formElement).toBeInTheDocument()

    const mockClose = vi.fn()
    Object.defineProperty(dialog, 'close', { value: mockClose })

    const mockDispatchEvent = vi.fn()
    document.addEventListener('documentCreated', mockDispatchEvent)

    fireEvent.change(screen.getByLabelText(/Document Name/), {
      target: { value: 'Test Document' },
    })
    fireEvent.change(screen.getByLabelText(/Version/), {
      target: { value: '1.0' },
    })
    fireEvent.change(screen.getByLabelText(/Contributors/), {
      target: { value: 'User 1; User 2' },
    })
    fireEvent.change(screen.getByLabelText(/Attachments/), {
      target: { value: 'file1.pdf; file2.pdf' },
    })

    fireEvent.submit(formElement!)

    expect(mockDispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'documentCreated',
        detail: expect.objectContaining({
          document: expect.objectContaining({
            name: 'Test Document',
            version: '1.0',
            contributors: ['User 1', 'User 2'],
            attachments: ['file1.pdf', 'file2.pdf'],
          }),
        }),
      })
    )

    expect(mockClose).toHaveBeenCalled()
    expect(screen.getByLabelText(/Document Name/)).toHaveValue('')
    expect(screen.getByLabelText(/Version/)).toHaveValue('')
    expect(screen.getByLabelText(/Contributors/)).toHaveValue('')
    expect(screen.getByLabelText(/Attachments/)).toHaveValue('')
  })
})

function openDialog() {
  const dialog = screen.getByRole('dialog', {
    hidden: true,
  }) as HTMLDialogElement
  dialog.showModal()
}
