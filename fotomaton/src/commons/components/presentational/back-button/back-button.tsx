import React from "react"

import useCustomNavigate from '@commons/hooks/use-custom-navigate'

import { ROUTE_PATHS } from '@app/components/routes/utils/route-paths'

import "./back-button.css"

const BackButton: React.FC = () => {
  const { customNavigate } = useCustomNavigate()

  return (
    <div className="back-button" onClick={() => customNavigate(ROUTE_PATHS.HOME)}>
      <p className="back-button__cross">X</p>
    </div>
  )
}

export default BackButton