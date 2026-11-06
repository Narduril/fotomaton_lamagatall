import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import useCamera from '@commons/hooks/use-camera/use-camera'

describe('useCamera', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    delete window.electronAPI
  })

  it('downloads the captured image when Electron is unavailable', async () => {
    delete window.electronAPI
    const context = { drawImage: vi.fn() } as unknown as CanvasRenderingContext2D
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context)
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/jpeg;base64,captured')
    const clickDownload = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    let downloadLink: HTMLAnchorElement | undefined
    vi.spyOn(document.body, 'appendChild').mockImplementation((element) => {
      if (element instanceof HTMLAnchorElement) downloadLink = element
      return element
    })

    const { result } = renderHook(() => useCamera())
    const video = document.createElement('video')
    Object.defineProperties(video, {
      videoWidth: { value: 640 },
      videoHeight: { value: 480 },
    })

    await act(async () => {
      await result.current.takePicture(
        { current: document.createElement('canvas') },
        { current: video },
      )
    })

    expect(clickDownload).toHaveBeenCalledOnce()
    expect(downloadLink?.download).toMatch(/^photo_\d+\.jpeg$/)
  })
})
