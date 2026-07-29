import { useState, useEffect } from 'react'
import { mmss } from '../../lib/format'
import type { useAudioPlayer } from '../../audio/AudioPlayer'
import { coverURL } from '../../storage/url'
import { Volume2, AudioLines } from 'lucide-react'
const RATES = [0.75, 1.0, 1.25, 1.5, 1.75, 2]

export function PlayerBar({ player }: { player: ReturnType<typeof useAudioPlayer> }) {
  const { current, playing, time, duration, volume, rate } = player
  const [scrub, setScrub] = useState<number | null>(null)
  const [cover, setCover] = useState<string | null>(null)
  const [configOpen, setConfigOpen] = useState(false)

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
      {/* Grid based positioning, alter if you would like */}
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
        {/* Implement a custom hover (so we can color it and stuff), generic text kinda boring */}
        <button title="Previous Track" onClick={player.prev} className="px-1 text-fg hover:text-heading">◀◀</button>
        <button title={playing ? 'Pause' : 'Play'} onClick={player.toggle} className="px-1 text-heading">{playing ? '❚❚' : '▶'}</button>
        <button title="Skip Track" onClick={player.next} className="px-1 text-fg hover:text-heading">▶▶</button>
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

      
      <div className="relative z-10 col-start-3 ml-auto flex items-center justify-end gap-2">
        <button title="Audio Configuration" onClick={() => setConfigOpen(prev => !prev) } className="text-fg hover:text-heading">
          <AudioLines size={18}/>
        </button>
        {/* Implemented speed control, have not started EQ yet */}
        {configOpen && (
          <div className="absolute bottom-full right-0 w-44 mb-2 rounded-lg border border-line bg-canvas p-3 shadow-lg">
            <p className="mb-2 text-xs font-medium text-heading">Playback Speed</p>
            <div>
              {RATES.map(r => (
                <button
                  key={r}
                  onClick={ () => player.setRate(r)}
                  className={`rounded px-2 py-1 text-xs tabular-nums ${
                    rate===r
                      ? 'bg-accent text-canvas'
                      : 'text-fg hover:bg-accent-bg hover:text-heading'
                  }`}
                >
                  {r}x
                </button>))}
            </div>
          </div>
        )}
        
        <Volume2 size={18} className="shrink-0 text-heading"></Volume2>
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
