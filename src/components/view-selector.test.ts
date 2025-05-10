import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ViewSelector } from './view-selector'
import { screen, fireEvent, within } from '@testing-library/dom'
import '@testing-library/jest-dom'

describe('ViewSelector', () => {
  let viewSelector: ViewSelector

  beforeEach(() => {
    viewSelector = new ViewSelector()
    document.body.appendChild(viewSelector)
  })

  it('should render the view selector', () => {
    expect(document.querySelector('view-selector')).toBeInTheDocument()
  })

  it('should render list and cards view options', () => {
    const viewSelector = screen.getByRole('radiogroup', {
      name: 'Select view type',
    })
    const options = within(viewSelector).getAllByRole('radio')

    expect(options).toHaveLength(2)
    expect(options[0]).toHaveAccessibleName('List view')
    expect(options[1]).toHaveAccessibleName('Cards view')
  })

  it('should have list view selected by default', () => {
    const listViewInput = screen.getByRole('radio', { name: 'List view' })
    expect(listViewInput).toBeChecked()
  })

  it('should emit viewChange event when changing view to cards', () => {
    const cardsViewInput = screen.getByRole('radio', { name: 'Cards view' })
    const eventSpy = vi.fn()
    viewSelector.addEventListener('viewChange', eventSpy)

    fireEvent.click(cardsViewInput)

    expect(eventSpy).toHaveBeenCalledWith(
      expect.objectContaining({ detail: 'cards' })
    )
  })

  it('should update selected view when setView is called to cards', () => {
    viewSelector.setView('cards')
    const cardsViewInput = screen.getByRole('radio', { name: 'Cards view' })
    expect(cardsViewInput).toBeChecked()
  })
})
