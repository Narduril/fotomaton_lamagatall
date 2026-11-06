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
