import { useState, useEffect } from 'react'
import type { Track } from '../../types'
import { coverURL } from '../../storage/url'
import { mmss } from '../../lib/format'

type Props = {
  track: Track
  active: boolean
  playing: boolean
  onPlay: () => void
}

export function TrackRow({ track, active, playing, onPlay }: Props) {
  const [cover, setCover] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void coverURL(track.id).then((u) => { if (!cancelled) setCover(u) })
    return () => { cancelled = true }
  }, [track.id])

  return (
    <li>
      <button
        onDoubleClick={(e) => { e.stopPropagation(); onPlay() }} // Since onDoubleClick also triggers fileInput.
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left`}
      >
        {cover
          ? <img src={cover} alt="" className="size-10 shrink-0 rounded object-cover" />
          : <div className="size-10 shrink-0 rounded bg-code" />}

        <div className="min-w-0 flex-1">
          <p className={`truncate text-sm ${active ? 'text-accent' : 'text-heading'}`}>
            {playing ? '▶ ' : ''}{track.title}
          </p>
          <p className="truncate text-xs text-fg">{track.artist}</p>
        </div>

        <span className="shrink-0 text-xs tabular-nums text-fg">{mmss(track.duration)}</span>
      </button>
    </li>
  )
}