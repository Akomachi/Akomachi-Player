import type { Track } from '../../types'
import { TrackRow } from './TrackRow.tsx'

type Props = {
  tracks: Track[]
  currentId: string | null
  playing: boolean
  onPlay: (t: Track) => void
}

export function LibraryView({ tracks, currentId, playing, onPlay }: Props) {
  if (tracks.length === 0) {
    return <p className="mt-8 text-center text-fg">No tracks yet. Drop some files above.</p>
  }

  return (
    <ul className="mt-6 flex flex-col">
      {tracks.map((t) => (
        <TrackRow
          key={t.id}
          track={t}
          active={t.id === currentId}
          playing={playing && t.id === currentId}
          onPlay={() => onPlay(t)}
        />
      ))}
    </ul>
  )
}