import { db } from "./db.ts"
import type { Playlist } from "../types.ts"

export async function getPlaylists(): Promise<Playlist[]>{
    return(await db()).getAll("playlists")
}

export async function createPlaylists(name: string): Promise<Playlist> {
    const pl: Playlist = { id: crypto.randomUUID(), name, entries: [], createdAt: Date.now()}
    await (await db()).put("playlists", pl)
    return pl
}

export async function addToPlaylist(playlistId: string, trackId: string) {
    const d = await db()
    const pl = await d.get("playlists", playlistId)
    if (!pl) return
    pl.entries.push({ uid: crypto.randomUUID(), trackId })
    await d.put("playlists", pl)
}