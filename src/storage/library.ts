import { db } from './db'
import { readTags } from "./metadata"
import type { Track } from '../types'


export async function hashFile(file: File): Promise<string> {
    const buffer = await crypto.subtle.digest("SHA-256", await file.arrayBuffer())
    return [...new Uint8Array(buffer)].slice(0,12).map(b => b.toString(16).padStart(2, "0")).join("")
}

export async function addTrack(file: File): Promise<Track> {
    const id = await hashFile(file)
    const d = await db()

    const existing = await d.get("tracks", id)
    if(existing) return existing

    const { title, artist, album, duration, coverBlob } = await readTags(file)
    const track: Track = {
        id,
        title: title || file.name.replace(/\.[^.]+$/, ''),
        artist: artist || 'Unknown Artist',
        album: album || null,
        duration,
        addedAt: Date.now()
    }

    const tx = d.transaction(["tracks", "audio", "covers"], "readwrite")
    await Promise.all([
        tx.objectStore("tracks").put(track),
        tx.objectStore("audio").put(file, id),
        coverBlob ? tx.objectStore("covers").put(coverBlob, id) : undefined,
        tx.done
    ]) 
    return track
}

export async function getTracks(): Promise<Track[]>{
    return (await db()).getAll("tracks")
}

export async function getTrack(id: string): Promise<Track | null>{
    return (await db()).get("tracks", id)
}