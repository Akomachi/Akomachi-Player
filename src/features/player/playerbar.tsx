import { useState, useEffect } from 'react'
import { mmss } from '../../lib/format'
import type { useAudioPlayer } from '../../audio/AudioPlayer'
import { coverURL } from '../../storage/url'
import { Volume2, AudioLines } from 'lucide-react'

export function PlayerBar({ player }: { player: ReturnType<typeof useAudioPlayer> }) {
  const { current, playing, time, duration, volume } = player
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
        {/* All of the button icons below, try and add a text on hover */}
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
        {/* Alter the position of the volume bar (currently too close to the seek bar, use Spotify's UI as a reference) */}
        <button title="Audio Configuration" onClick={() => setConfigOpen(prev => !prev) } className="text-fg hover:text-heading">
          <AudioLines size={18}/>
        </button>
        {/* if its not super hard maybe we can make a small eq or like a speed up / slow down option! */}
        {configOpen && (
          <div className="absolute bottom-full mb-2 rounded bg-gray-700 p-3 text-white">
            Audio Configuration
          </div>
        )}
        
        <Volume2 size={18} className="shrink-0 text-heading"></Volume2> {/* Please fix this, volume icon isn't displaying correctly */}
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