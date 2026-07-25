import type { Track } from '../../types'
import { TrackRow } from './TrackRow.tsx'

type Props = {
  tracks: Track[]
  currentId: string | null
  playing: boolean
  onPlay: (t: Track) => void
}

export function LibraryView({ tracks, currentId, playing, onPlay }: Props) {

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