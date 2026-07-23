import { useState, useRef, useEffect } from 'react'
import { parseBlob } from 'music-metadata'
import "./GetFiles.css"

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
        <div className={`drop-area ${dragging ? 'dragging' : ''}`}
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
            <div className="track-info">
                {track.cover ? <img src={track.cover} alt="Cover" /> : <div className="placeholder" />}
                <div>
                    <h3>{track.title}</h3>
                    <p>{track.artist}</p>
                </div>
            </div>
        ) : (
            <p>Drag and drop an audio file here</p>
        )}

        </div>
    )


}

export default GetFiles