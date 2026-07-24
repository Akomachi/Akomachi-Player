import { parseBlob } from 'music-metadata'

export type Tags = {
  title: string | null
  artist: string | null
  album: string | null
  duration: number
  coverBlob: Blob | null
}

export async function readTags(file: File): Promise<Tags> {
  const { common, format } = await parseBlob(file)
  const pic = common.picture?.[0]
  const coverBlob = pic ? new Blob([new Uint8Array(pic.data)], { type: pic.format }) : null

  return {
    title: common.title ?? null,
    artist: common.artist ?? null,
    album: common.album ?? null,
    duration: format.duration ?? 0,
    coverBlob,
  }
}