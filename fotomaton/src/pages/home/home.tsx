import useCustomNavigate from '../../commons/hooks/use-custom-navigate/use-custom-navigate'

import { ROUTE_PATHS } from '../../application/components/routes/utils/route-paths'

import logoPenya from "../../application/assets/img/logo_penya.png"

import './home.css'

const HomePage: React.FC = () => {
  const { customNavigate } = useCustomNavigate()

  return (
    <>
      <div>
        <img src={logoPenya} className="logo react" alt="React logo" />
      </div>
      <h1>FOTO MATÓN PENYA L' AMAGATALL</h1>
      <div className="button">
        <button onClick={() => customNavigate(ROUTE_PATHS.CAMERA)}>
          CÁMARA
        </button>
        <button onClick={() => customNavigate(ROUTE_PATHS.PHOTOS_LIST)}>
          ARCHIVO FOTOS
        </button>
      </div>
    </>
  )
}

export default HomePage
