import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ViewSelector } from './view-selector'

describe('ViewSelector', () => {
  let viewSelector: ViewSelector

  beforeEach(() => {
    viewSelector = new ViewSelector()
    document.body.appendChild(viewSelector)
  })

  it('should render the view selector', () => {
    expect(document.querySelector('view-selector')).not.toBeNull()
  })

  it('should render list and cards view options', () => {
    const inputs = document.querySelectorAll('input[type="radio"]')
    expect(inputs.length).toBe(2)
    expect(inputs[0].getAttribute('aria-label')).toBe('List view')
    expect(inputs[1].getAttribute('aria-label')).toBe('Cards view')
  })

  it('should have list view selected by default', () => {
    const listViewInput = document.querySelector(
      'input[aria-label="List view"]'
    ) as HTMLInputElement
    expect(listViewInput.checked).toBe(true)
  })

  it('should emit viewChange event when changing view to cards', () => {
    const cardsViewInput = document.querySelector(
      'input[aria-label="Cards view"]'
    ) as HTMLInputElement
    const eventSpy = vi.fn()
    viewSelector.addEventListener('viewChange', eventSpy)
    cardsViewInput.click()
    expect(eventSpy).toHaveBeenCalledWith(
      expect.objectContaining({ detail: 'cards' })
    )
  })

  it('should update selected view when setView is called to cards', () => {
    viewSelector.setView('cards')
    const cardsViewInput = document.querySelector(
      'input[aria-label="Cards view"]'
    ) as HTMLInputElement
    expect(cardsViewInput.checked).toBe(true)
  })
})
