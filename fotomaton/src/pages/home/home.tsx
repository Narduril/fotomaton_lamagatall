import useCustomNavigate from '@commons/hooks/use-custom-navigate/use-custom-navigate'

import usePhotosStore from '@app/store/use-photos-store'

import { ROUTE_PATHS } from '@app/components/routes/utils/route-paths'

import logoPenya from '@app/assets/img/logo_penya.png'

import './home.css'

const HomePage: React.FC = () => {
  const { customNavigate } = useCustomNavigate()
  const { photos } = usePhotosStore()

  return (
    <main className="home">
      <section className="home__card" aria-labelledby="home-title">
        <div className="home__brand">
          <img src={logoPenya} className="home__logo" alt="Penya L'Amagatall, Benidorm 2010" />
          <span className="home__eyebrow">Benidorm · desde 2010</span>
        </div>

        <div className="home__content">
          <p className="home__kicker">Un recuerdo para llevarte</p>
          <h1 className="home__title" id="home-title">Nuestro fotomatón</h1>
          <p className="home__description">
            Prepara tu mejor sonrisa y crea un recuerdo de la fiesta.
          </p>

          <div className="home__actions">
            <button
              className="home__button home__button--primary"
              onClick={() => customNavigate(ROUTE_PATHS.CAMERA)}
            >
              <span className="home__button-icon" aria-hidden="true">●</span>
              Hacerme una foto
            </button>
            <button
              disabled={!photos.length}
              className="home__button home__button--secondary"
              onClick={() => customNavigate(ROUTE_PATHS.PHOTOS_LIST)}
            >
              Ver la galería
              {photos.length > 0 && <span className="home__photo-count">{photos.length}</span>}
            </button>
          </div>
          <p className="home__note">La cámara hará dos capturas automáticamente</p>
        </div>
      </section>
    </main>
  )
}

export default HomePage
