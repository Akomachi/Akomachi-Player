export type Track = {
    id: string
    title: string
    artist: string
    album: string | null
    duration: number
    addedAt: number
}

export type Playlist = {
    id: string
    name: string
    entires: {uid: string, trackId: string}[]
    createdAt: number
}

