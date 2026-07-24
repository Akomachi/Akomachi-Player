import { useState, useRef } from 'react'
import { addTrack } from '../../storage/library'
import type { Track } from "../../types"

export default function getFiles({ onAdded }: { onAdded: (t: Track) => void }){
    const [dragging, setDragging] = useState(false)
    const [busy, setBusy] = useState(0)
    const depth = useRef(0)

    async function handleFiles(files: FileList) {
        const audio = Array.from(files).filter(f => /^audio\//.test(f.type))
        setBusy(audio.length)
        for (const file of audio) {
            try{
                onAdded(await addTrack(file))
            } catch (err){
                console.log("Failed to add", file.name, err)
            } finally {
                setBusy(n => n-1)
            }
        }
        }
    return (
        <div
            onDragEnter={e => { e.preventDefault(); depth.current++; setDragging(true) }}
            onDragLeave={e => { e.preventDefault(); if (--depth.current === 0) setDragging(false) }}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
                e.preventDefault()
                depth.current = 0
                setDragging(false)
                void handleFiles(e.dataTransfer.files)
            }}
        className={"flex"}
    >
      {busy > 0 ? <p>Adding {busy}…</p> : <p>Drag and drop audio files here</p>}
    </div>
    )
}

