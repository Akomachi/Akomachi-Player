import { useLibrary } from './features/library/library'
import { useAudioPlayer } from './audio/AudioPlayer'
import DropZone from './features/FileRetrieval/GetFiles'
import { LibraryView } from './features/library/libraryView'
import { PlayerBar } from './features/player/playerbar'

export default function App() {
  const { tracks, add } = useLibrary()
  const player = useAudioPlayer()

  return (
    <div className="flex h-svh flex-col">
      <header className="border-line px-6 py-4 border-b-3 border-b-indigo-300">
        <h1 className="text-5xl font-bold text-heading">Library</h1>
        <img className="h-28 w-28 object-scale-down absolute right-3 top-2" src="src/assets/icon.png"></img>
        <h1 className="text-3xl text-heading absolute right-32 top-6">Akomachi</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-4">
        <DropZone onAdded={add} />
        <LibraryView
          tracks={tracks}
          currentId={player.current?.id ?? null}
          playing={player.playing}
          onPlay={(t) => player.playTrack(t, tracks.map((x) => x.id))}
        />
      </main>

      <PlayerBar player={player} />
    </div>
  )
}