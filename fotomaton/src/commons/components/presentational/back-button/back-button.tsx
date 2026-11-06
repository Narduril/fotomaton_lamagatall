import React from "react"

import useCustomNavigate from '@commons/hooks/use-custom-navigate'

import { ROUTE_PATHS } from '@app/components/routes/utils/route-paths'

import '@commons/components/presentational/back-button/back-button.css'

const BackButton: React.FC = () => {
  const { customNavigate } = useCustomNavigate()

  return (
    <button
      className="back-button"
      type="button"
      aria-label="Volver al inicio"
      onClick={() => customNavigate(ROUTE_PATHS.HOME)}
    >
      <span aria-hidden="true">←</span>
    </button>
  )
}

export default BackButton