import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Track, Playlist } from '../types'

/*

Simple database configuration here
For testing, if you want to reset the entire DB for yourself, write indexedDB.delete('music') in DevTools

*/

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

