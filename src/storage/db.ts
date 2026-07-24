import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Track, Playlist } from '../types'
import { parseBlob } from 'music-metadata';

interface LibraryDB extends DBSchema {
    tracks: {key: string; value: Track; indexes: {byArtist: string}}
    audio: {key: string; value: Blob }
    covers: {key: string; value: Blob }
    playlists: {key: string; value: Playlist }
}

let dpb: Promise<IDBPDatabase<LibraryDB>> | null = null

export function db(){
    if(!dpb){
        dpb = openDB<LibraryDB>("music", 1,{
            upgrade(d) {
                const t = d.createObjectStore("tracks", {keyPath: "id"})
                t.createIndex("byArtist", "artist")
                d.createObjectStore("audio")
                d.createObjectStore("covers")
                d.createObjectStore("playlists", {keyPath: "id"})
            },
        })
    }
    return dpb
}

export async function hashFile(file: File): Promise<string> {
    const buffer = await crypto.subtle.digest("SHA-256", await file.arrayBuffer())
    return [...new Uint8Array(buffer)].slice(0,12).map(b => b.toString(16).padStart(2, "0")).join("")
}

export async function addTrack(file: File): Promise<Track> {
    const id = await hashFile(file)
    const d = await db()

    const existing = await d.get("tracks", id)
    if(existing) return existing

    const { common, format } = await parseBlob(file)
    const pic = common.picture?.[0]
    const coverBlob = pic ? new Blob([new Uint8Array(pic.data)], { type: pic.format }) : null
    const track: Track = {
        id,
        title: common.title || file.name,
        artist: common.artist || 'Unknown Artist',
        album: common.album || null,
        duration: format.duration || 0,
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