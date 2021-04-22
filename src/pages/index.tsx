import Head from 'next/head'
import { useEffect } from 'react'
import { GetStaticProps } from 'next'
import Image from 'next/image'
import api from '../services/api'
import { ptBR } from 'date-fns/locale/pt-BR'
import { format, parseISO } from 'date-fns'
import { convertDurationToTimeString } from '../utils/convertDuratinToTimeString'
import styles from './home.module.scss'
import { ESPIPE } from 'node:constants'

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
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos Lançamentos</h2>
        <ul>
          {latestEpisodes.map((episode) => {
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
                  <a href="">{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.published_at}</span>
                  <span>{episode.durationAsString}</span>
                </div>
                <button type="button">
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
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th></th>
            <th>Duração</th>
            <th></th>
          </thead>
          <tbody>
            {allEpisodes.map((episode) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: '150px' }}>
                    <Image
                      width={192}
                      height={192}
                      alt={episode.title}
                      objectFit="fill"
                      src={episode.thumbnail}
                    />
                  </td>
                  <td>
                    <a href="">{episode.title}</a>
                  </td>
                  <td>{episode.members}</td>
                  <td>{episode.published_at}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    {' '}
                    <button type="button">
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
