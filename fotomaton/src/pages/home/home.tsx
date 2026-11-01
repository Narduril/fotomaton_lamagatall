import useCustomNavigate from '@commons/hooks/use-custom-navigate/use-custom-navigate'

import usePhotosStore from '@app/store/use-photos-store'

import { ROUTE_PATHS } from '@app/components/routes/utils/route-paths'

import logoPenya from '@app/assets/img/logo_penya.png'

import './home.css'

const HomePage: React.FC = () => {
  const { customNavigate } = useCustomNavigate()
  const { photos } = usePhotosStore()

  return (
    <>
      <div>
        <img src={logoPenya} className="logo react" alt="React logo" />
      </div>
      <h1>FOTOMATÓN PENYA L' AMAGATALL</h1>
      <div className="button">
        <button className="home__button" onClick={() => customNavigate(ROUTE_PATHS.CAMERA)}>
          CÁMARA
        </button>

        <button disabled={!photos.length} className="home__button" onClick={() => customNavigate(ROUTE_PATHS.PHOTOS_LIST)}>
          GALERÍA
        </button>
      </div>
    </>
  )
}

export default HomePage
