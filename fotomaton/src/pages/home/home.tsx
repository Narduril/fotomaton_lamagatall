import useCustomNavigate from '@commons/hooks/use-custom-navigate/use-custom-navigate';

import { ROUTE_PATHS } from '@app/components/routes/utils/route-paths';

import logoPenya from '@app/assets/img/logo_penya.png';

import '@pages/home/home.css';

const HomePage: React.FC = () => {
  const { customNavigate } = useCustomNavigate();

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
