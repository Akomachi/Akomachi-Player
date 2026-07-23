import { useState, useRef, useEffect } from 'react'
import { parseBlob } from 'music-metadata'

type Track = {
    title: string
    artist: string
    cover: string | null
}

const GetFiles = () => {
    const [track, setTrack] = useState<Track | null>(null)
    const [dragging, setDragging] = useState(false)
    const depth = useRef(0)
    useEffect(() => {
        const urlCover = track?.cover
        return () => { if (urlCover) URL.revokeObjectURL(urlCover) }
    }, [track])

    async function readTrack(file: File): Promise<Track> {
        const { common } = await parseBlob(file)
        const pic = common.picture?.[0]
        return {
            title: common.title || file.name,
            artist: common.artist || 'Unknown Artist',
            cover: pic ? URL.createObjectURL(new Blob([new Uint8Array(pic.data)], { type: pic.format })) : null
        }
    }

    return (
        <div className={`border-double flex min-h-16 items-center justify-center rounded-xl border-2 border-white  p-10 transition-colors ${dragging ? 'border-accent-line bg-accent-bg' : 'border-line'}`}
            onDragEnter={(e) => {
                e.preventDefault()
                depth.current++
                setDragging(true)
            }}
            onDragLeave={(e) => {
            e.preventDefault()
            depth.current--
            if (depth.current === 0) setDragging(false)
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={async (e) => {
            e.preventDefault()
            depth.current = 0
            setDragging(false)
            const file = e.dataTransfer.files[0]
            if (file) {
                const track = await readTrack(file)
                setTrack(track)
            }
        }}
        > {track ? (
            <div className="item-center flex flex-col gap-2 justify-center mt-45 text-center">
                {track.cover ? (
                    <img 
                    src={track.cover} 
                    alt="Cover"
                    className="h-64 w-64 object-cover rounded-lg shadow-lg" 
                    />) : (<div className="placeholder" />)}
                <div className = "min-w-0">
                    <h3 className = "truncate text-lg font-semibold text-yellow-300">{track.title}</h3>
                    <p className = "text-white font-semibold">{track.artist}</p>
                </div>
            </div>
        ) : (
            <p className="text-3xl text-white">Drag and drop an audio file here</p>
        )}

        </div>
    )


}

export default GetFiles