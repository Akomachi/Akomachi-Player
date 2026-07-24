import { useState, useEffect, useCallback} from "react"
import type { Track } from "../../types"
import { getTracks } from "../../storage/library"

export function useLibrary() {
  const [tracks, setTracks] = useState<Track[]>([])

  useEffect(() => {
    void getTracks().then(setTracks)
  }, [])

  const add = useCallback((t: Track) => {
    setTracks(prev => prev.some(x => x.id === t.id) ? prev : [...prev, t])
  }, [])

  return { tracks, add }
}