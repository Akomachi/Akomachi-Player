import { useState, useEffect, useCallback } from 'react'
import { engine } from './engine'
import { audioURL } from '../storage/url'
import { getTrack } from '../storage/library'
import type { Track } from '../types'
import { queue } from "./queue"  

export function AudioPlayer(){
    const [current, setCurrent] = useState<Track | null>(null)
    const [playing, setPlaying] = useState(false)
    const [time, setTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)

    const playId = useCallback(async (id:string) => {
        const track = await getTrack(id)
        const url = track ? await audioURL(id) : null
        if (!track || !url) return
        engine.load(url)
        setCurrent(track)
        try {
            await engine.play()
        } catch (err) {
            if ((err as DOMException).name !== 'AbortError') console.error(err)
        }
    }, [])

    useEffect(() => {
        const offs=[
            engine.on("play", () => setPlaying(true)),
            engine.on("pause", () => setPlaying(false)),
            engine.on("timeupdate", () => setTime(engine.el.currentTime)),
            engine.on("durationchange", () => setDuration(engine.el.duration || 0)),
            engine.on("volumechange", () => setVolume(engine.el.volume)),
            engine.on("ended", () => { const n = queue.next(); if (n) void playId(n) }),
        ]
        return () => offs.forEach(off => off())
    }), [playId]

    

}