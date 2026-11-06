import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const cameraMocks = vi.hoisted(() => ({
  startCamera: vi.fn(),
  takePicture: vi.fn(),
  setPhoto: vi.fn(),
  customNavigate: vi.fn(),
}))

vi.mock('@commons/hooks/use-camera', () => ({
  default: () => ({
    startCamera: cameraMocks.startCamera,
    takePicture: cameraMocks.takePicture,
    isCameraAvailable: true,
  }),
}))

vi.mock('@commons/hooks/use-custom-navigate', () => ({
  default: () => ({ customNavigate: cameraMocks.customNavigate }),
}))

vi.mock('@app/store/use-photos-store', () => ({
  default: () => ({ setPhoto: cameraMocks.setPhoto }),
}))

vi.mock('@commons/components/presentational/back-button', () => ({
  default: () => null,
}))

import CameraPage from '@pages/camera/camera'

describe('CameraPage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    cameraMocks.startCamera.mockReset()
    cameraMocks.takePicture.mockReset()
    cameraMocks.setPhoto.mockReset()
    cameraMocks.customNavigate.mockReset()
    cameraMocks.takePicture
      .mockResolvedValueOnce('data:image/jpeg;base64,first')
      .mockResolvedValueOnce('data:image/jpeg;base64,second')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('automatically starts the next capture after showing the first photo', async () => {
    render(<CameraPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Hacer dos fotos' }))

    const advance = async (milliseconds: number) => {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(milliseconds)
      })
    }

    for (let second = 0; second < 3; second += 1) {
      await advance(1_000)
    }
    expect(cameraMocks.takePicture).not.toHaveBeenCalled()
    await advance(700)

    expect(cameraMocks.takePicture).toHaveBeenCalledTimes(1)
    expect(cameraMocks.setPhoto).toHaveBeenCalledWith('data:image/jpeg;base64,first')
    expect(screen.getByAltText('Foto 1 de la sesión')).toBeInTheDocument()

    await advance(2_000)
    expect(screen.getByText(/Foto 2/)).toBeInTheDocument()

    for (let second = 0; second < 3; second += 1) {
      await advance(1_000)
    }
    await advance(700)
    expect(cameraMocks.takePicture).toHaveBeenCalledTimes(2)
    expect(cameraMocks.setPhoto).toHaveBeenCalledWith('data:image/jpeg;base64,second')
    expect(screen.getByAltText('Foto 2 de la sesión')).toBeInTheDocument()
  })
})
