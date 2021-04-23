import { useContext, useRef, useEffect } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { PlayerContext, usePlayer } from '../../contexts/PlayerContext'
import styles from './styles.module.scss'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function Player() {
  const {
    episodeList,
    setPlayingState,
    currentEpisodeIndex,
    playNext,
    playPrevius,
    isPlaying,
    isShuffling,
    togglePlay,
    hasNext,
    hasPrevius,
    isLooping,
    toggleLoop,
    toggleShuffle,
  } = usePlayer()

  const audioRef = useRef<HTMLAudioElement>(null)
  const episode = episodeList[currentEpisodeIndex]

  useEffect(() => {
    if (!audioRef.current) {
      return
    }

    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

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
          {episode && (
            <audio
              // onPlay={() => setPlayingState(true)}
              // onPause={() => setPlayingState(false)}
              ref={audioRef}
              src={episode.url}
              autoPlay
              loop={isLooping}
            />
          )}
        </div>
        <div className={styles.buttons}>
          <button
            type="button"
            className={isShuffling ? styles.isActive : ''}
            onClick={toggleShuffle}
            disabled={!episode || episodeList.length === 1}
          >
            <img src="/shuffle.svg" alt="embaralhar" />
          </button>
          <button type="button" onClick={playPrevius} disabled={!episode || !hasPrevius}>
            <img src="/play-previous.svg" alt="tocar-anterior" />
          </button>

          <button type="button" disabled={!episode} onClick={togglePlay}>
            {isPlaying ? (
              <img src="/pause.svg" className={styles.playButton} alt="repetir" />
            ) : (
              <img src="/play.svg" className={styles.playButton} alt="repetir" />
            )}
          </button>

          <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" className={styles.playButton} alt="repetir" />
          </button>
          <button
            type="button"
            className={isLooping ? styles.isActive : ''}
            onClick={toggleLoop}
            disabled={!episode}
          >
            <img src="/repeat.svg" className={styles.playButton} alt="repetir" />
          </button>
        </div>
      </footer>
    </div>
  )
}
