import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import PhotoModal from '@pages/photos-list/components/photo-modal'

describe('PhotoModal', () => {
  it('renders the enlarged photo as an accessible modal when visible', () => {
    render(<PhotoModal isVisible photo="file:///photos/photo.jpg" closeModal={vi.fn()} />)

    expect(screen.getByRole('dialog', { name: 'Foto ampliada' })).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByRole('img', { name: 'Foto ampliada' })).toHaveAttribute(
      'src',
      'file:///photos/photo.jpg',
    )
  })

  it('does not render while hidden', () => {
    render(<PhotoModal isVisible={false} photo="" closeModal={vi.fn()} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.body.style.overflow).not.toBe('hidden')
  })

  it('disables page scrolling while visible and restores the previous overflow when closed', () => {
    document.body.style.overflow = 'auto'
    document.documentElement.style.overflow = 'scroll'
    const { rerender, unmount } = render(
      <PhotoModal isVisible photo="file:///photos/photo.jpg" closeModal={vi.fn()} />,
    )

    expect(document.body.style.overflow).toBe('hidden')
    expect(document.documentElement.style.overflow).toBe('hidden')

    rerender(<PhotoModal isVisible={false} photo="" closeModal={vi.fn()} />)
    expect(document.body.style.overflow).toBe('auto')
    expect(document.documentElement.style.overflow).toBe('scroll')

    rerender(<PhotoModal isVisible photo="file:///photos/photo.jpg" closeModal={vi.fn()} />)
    expect(document.body.style.overflow).toBe('hidden')
    expect(document.documentElement.style.overflow).toBe('hidden')

    unmount()
    expect(document.body.style.overflow).toBe('auto')
    expect(document.documentElement.style.overflow).toBe('scroll')
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
  })

  it('closes from the close button and backdrop but not from inside the dialog', () => {
    const closeModal = vi.fn()
    const { container } = render(
      <PhotoModal isVisible photo="file:///photos/photo.jpg" closeModal={closeModal} />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar foto ampliada' }))
    expect(closeModal).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('dialog'))
    expect(closeModal).toHaveBeenCalledTimes(1)

    fireEvent.click(container.querySelector('.photo-modal')!)
    expect(closeModal).toHaveBeenCalledTimes(2)
  })
})
