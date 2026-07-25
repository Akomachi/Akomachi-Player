import { useState, useRef } from 'react'
import { useLibrary } from './features/library/library'
import { useAudioPlayer } from './audio/AudioPlayer'
import { LibraryView } from './features/library/libraryView'
import { PlayerBar } from './features/player/playerBar'
import { addTrack } from './storage/library'

const AUDIO = /\.(mp3|wav|flac|m4a|ogg|opus)$/i
const isAudio = (f: File) => /^audio\//.test(f.type) || AUDIO.test(f.name)

export default function App() {
  const { tracks, add } = useLibrary()
  const player = useAudioPlayer()
  const [dragging, setDragging] = useState(false)
  const depth = useRef(0)
  const fileInput = useRef<HTMLInputElement | null>(null)

  async function handleFiles(files: FileList) {
    for (const file of Array.from(files)) {
      if (!isAudio(file)) continue
      try {
        add(await addTrack(file))
      } catch (err) {
        console.error('failed to add', file.name, err)
      }
    }
  }

  return (
    <div
      className="relative flex h-svh flex-col"
      onDragEnter={(e) => { e.preventDefault(); depth.current++; setDragging(true) }}
      onDragLeave={(e) => { e.preventDefault(); if (--depth.current === 0) setDragging(false) }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        depth.current = 0
        setDragging(false)
        void handleFiles(e.dataTransfer.files)
      }}
    >
      <header className="flex items-center gap-5 border-b border-line px-6 py-4">
        <h1 className="text-5xl font-medium text-heading">Library</h1>
        <button
          onClick={() => fileInput.current?.click()}
          className="mt-3 rounded-lg border border-line px-4 py-2 text-sm text-white font-semibold hover:bg-code"
        >
          Add files
        </button>
        <h1 className="text-3xl text-heading absolute right-32 top-6">Akomachi</h1>
        <img className="h-28 w-28 object-scale-down absolute right-3 top-2" src="src/assets/icon.png"></img>
      </header>

      <main
        className="flex-1 overflow-y-auto px-6 py-4"
        onDoubleClick={() => fileInput.current?.click()}
      >
        {tracks.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center p-16 text-fg">
            {/* Feel free to alter this */}
            <p className="text-lg text-white"><span className="text-accent">Drop audio files</span> anywhere to add them</p>
            <p className="mt-1 text-sm text-fg/70">or <span className="text-accent">double-click</span> anywhere</p>
          </div>
        ) : (
          <LibraryView
            tracks={tracks}
            currentId={player.current?.id ?? null}
            playing={player.playing}
            onPlay={(t) => player.playTrack(t, tracks.map((x) => x.id))}
          />
        )}
      </main>

      <PlayerBar player={player} />

      <input
        ref={fileInput}
        type="file"
        accept="audio/*,.mp3,.wav,.flac,.m4a,.ogg,.opus"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) void handleFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {dragging && (
        <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-accent-bg/80 backdrop-blur-sm">
          <p className="rounded-xl border-2 border-accent-line p-10 text-2xl text-heading">
            Drop audio files anywhere
          </p>
        </div>
      )}
    </div>
  )
}