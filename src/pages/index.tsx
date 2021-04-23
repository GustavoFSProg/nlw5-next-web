import Head from 'next/head'
import { useContext, useEffect } from 'react'
import { GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ESPIPE } from 'node:constants'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import api from '../services/api'
import { convertDurationToTimeString } from '../utils/convertDuratinToTimeString'
import styles from './home.module.scss'
import { PlayerContext, usePlayer } from '../contexts/PlayerContext'

type Episode = {
  id: string
  title: string
  members: string
  published_at: Date
  thumbnail: string
  duration: number
  durationAsString: string
  description: string
  url: string
}

type HomeProps = {
  latestEpisodes: Episode[]
  allEpisodes: Episode[]
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayer()

  const episodeList = [...latestEpisodes, ...allEpisodes]

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos Lançamentos </h2>
        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />
                <div className={styles.epidodesDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span style={{ width: '70px' }}>{episode.published_at}</span>
                  <span>{episode.durationAsString}</span>
                </div>
                <button type="button" onClick={() => playList(episodeList, index)}>
                  <img src="/play-green.svg" alt="tocar episodio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2> Todos Episodios</h2>

        <table cellSpacing="0">
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: '72px' }}>
                    <Image
                      width={192}
                      height={192}
                      alt={episode.title}
                      objectFit="fill"
                      src={episode.thumbnail}
                    />
                  </td>
                  <td style={{ paddingTop: ' 14px' }}>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td style={{ paddingTop: '25  px' }}>{episode.members}</td>
                  <td style={{ width: '70px' }}>{episode.published_at}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    {' '}
                    <button
                      type="button"
                      onClick={() => playList(episodeList, index + latestEpisodes.length)}
                    >
                      <img src="/play-green.svg" alt="tocar episodio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'publish_at',
      _order: 'desc',
    },
  })

  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      published_at: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.lenght)

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}

// function published_at(published_at: any) {
//   throw new Error('Function not implemented.')
// }
