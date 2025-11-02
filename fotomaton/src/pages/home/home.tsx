import { useNavigate } from "react-router-dom"

import { ROUTE_PATHS } from '../../application/components/routes/utils/route-paths'

import logoPenya from "../../application/assets/img/logo_penya.png"

import './home.css'

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <img src={logoPenya} className="logo react" alt="React logo" />
      </div>
      <h1>FOTO MATÓN PENYA L' AMAGATALL</h1>
      <div className="button">
        <button onClick={() => navigate(ROUTE_PATHS.CAMERA)}>
          CÁMARA
        </button>
      </div>
    </>
  )
}

export default HomePage
