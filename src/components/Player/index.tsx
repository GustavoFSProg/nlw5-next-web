import { useContext } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { PlayerContext } from '../../contexts/PlayerContext'
import styles from './styles.module.scss'
import Image from 'next/image'

export default function Player() {
  const { episodeList, currentEpisodeIndex } = useContext(PlayerContext)
  const episode = episodeList[currentEpisodeIndex]

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="playing" />
        <strong>Tocando Agora </strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />

          <strong>{episode.title}</strong>
          <br />
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}
      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>00:00</span>
        </div>
        <div className={styles.buttons}>
          <button type="button" disabled={!episode}>
            <img src="/shuffle.svg" alt="embaralhar" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-previous.svg" alt="tocar-anterior" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play.svg" className={styles.playButton} alt="repetir" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-next.svg" className={styles.playButton} alt="repetir" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/repeat.svg" className={styles.playButton} alt="repetir" />
          </button>
        </div>
      </footer>
    </div>
  )
}
