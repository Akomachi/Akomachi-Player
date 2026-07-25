import { useState, useEffect } from 'react'
import { mmss } from '../../lib/format'
import type { useAudioPlayer } from '../../audio/AudioPlayer'
import { coverURL } from '../../storage/url'
import { Volume2 } from 'lucide-react'

export function PlayerBar({ player }: { player: ReturnType<typeof useAudioPlayer> }) {
  const { current, playing, time, duration, volume } = player
  const [scrub, setScrub] = useState<number | null>(null)
  const [cover, setCover] = useState<string |null>(null)

  useEffect(() => {
    if (!current){
      setCover(null)
      return
    }
    let cancelled = false
    void coverURL(current.id).then((u) => { if (!cancelled) setCover(u) })
        return () => { cancelled = true }
  }, [current?.id])

  if (!current) return null

  return (
    <div className="relative grid grid-cols-[20rem_auto_20rem] items-center gap-4 border-t border-line px-3 py-3">
      <div className="flex min-w-0 items-center gap-2">
        <div className="size-10 shrink-0 overflow-hidden rounded bg-code">
          {cover ? (
            <img src={cover} alt="" className="size-full object-cover"></img>
          ) : null}
        </div>
        <div className="min-w-0 w-56">
          <p className="truncate text-sm font-medium text-heading">{current.title}</p>
          <p className="truncate text-xs text-fg">{current.artist}</p>
        </div>
      </div>
      <div className = "flex items-center gap-1">
        <button onClick={player.prev} className="px-1 text-fg hover:text-heading">◀◀</button>
        <button onClick={player.toggle} className="px-1 text-heading">{playing ? '❚❚' : '▶'}</button>
        <button onClick={player.next} className="px-1 text-fg hover:text-heading">▶▶</button>
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
      </div>
      
      <div className="relative z-10 col-start-3 flex min-w-0 w-20 items-center justify-end gap-2">
        <Volume2 size={18} className="text-heading"></Volume2>
        <input
          type="range" min={0} max={1} step={0.01}
          value={volume}
          onChange={e => player.setVolume(Number(e.target.value))}
          className="w-24 accent-accent"
        />
      </div>
      
    </div>
  )
}