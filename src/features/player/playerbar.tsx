import { useState } from 'react'
import { mmss } from '../../lib/format'
import type { useAudioPlayer } from '../../audio/AudioPlayer'

export function PlayerBar({ player }: { player: ReturnType<typeof useAudioPlayer> }) {
  const { current, playing, time, duration, volume } = player
  const [scrub, setScrub] = useState<number | null>(null)

  if (!current) return null

  return (
    <div className="flex items-center gap-4 border-t border-line px-4 py-3">
      <div className="min-w-0 w-56">
        <p className="truncate text-sm font-medium text-heading">{current.title}</p>
        <p className="truncate text-xs text-fg">{current.artist}</p>
      </div>

      <button onClick={player.prev} className="px-2 text-fg hover:text-heading">◀◀</button>
      <button onClick={player.toggle} className="px-2 text-heading">{playing ? '❚❚' : '▶'}</button>
      <button onClick={player.next} className="px-2 text-fg hover:text-heading">▶▶</button>

      <span className="w-10 text-right text-xs tabular-nums text-fg">
        {mmss(scrub ?? time)}
      </span>
      <input
        type="range" min={0} max={duration || 0} step={0.1}
        value={scrub ?? time}
        onChange={e => setScrub(Number(e.target.value))}
        onPointerUp={() => { if (scrub !== null) { player.seek(scrub); setScrub(null) } }}
        className="flex-1 accent-accent"
      />
      <span className="w-10 text-xs tabular-nums text-fg">{mmss(duration)}</span>

      <input
        type="range" min={0} max={1} step={0.01}
        value={volume}
        onChange={e => player.setVolume(Number(e.target.value))}
        className="w-24 accent-accent"
      />
    </div>
  )
}