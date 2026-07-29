import { useState, useEffect, useCallback } from 'react'
import { engine } from './engine'
import { audioURL, coverURL } from '../storage/url'
import { getTrack } from '../storage/library'
import type { Track } from '../types'
import { queue } from "./queue"  

export function useAudioPlayer(){
    const [current, setCurrent] = useState<Track | null>(null)
    const [playing, setPlaying] = useState(false)
    const [time, setTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [rate, setRate] = useState(1)

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

    const next = useCallback(() => {
        const n = queue.next()
        if (n) void playId(n)
    }, [playId])

    const prev = useCallback(() => {
        const p = queue.prev()
        if (p) void playId(p)
    }, [playId])

    useEffect(() => {
        if (!current || !('mediaSession' in navigator)) return

        let cancelled = false

        void coverURL(current.id).then(u => {
            if (cancelled) return
            navigator.mediaSession.metadata = new MediaMetadata({
            title: current.title,
            artist: current.artist,
            album: current.album ?? '',
            artwork: u ? [{ src: u, sizes: '512x512', type: 'image/jpeg' }] : [],
            })
        })

        navigator.mediaSession.setActionHandler('play', () => void engine.play())
        navigator.mediaSession.setActionHandler('pause', () => engine.pause())
        navigator.mediaSession.setActionHandler('nexttrack', next)
        navigator.mediaSession.setActionHandler('previoustrack', prev)
        return () => { cancelled = true }

    }, [current])
    useEffect(() => {
        const offs=[
            engine.on("play", () => setPlaying(true)),
            engine.on("pause", () => setPlaying(false)),
            engine.on("timeupdate", () => setTime(engine.el.currentTime)),
            engine.on("durationchange", () => setDuration(engine.el.duration || 0)),
            engine.on("volumechange", () => setVolume(engine.el.volume)),
            engine.on("ratechange", () => setRate(engine.el.playbackRate)),
            engine.on("ended", () => { const n = queue.next(); if (n) void playId(n) }),
        ]
        return () => offs.forEach(off => off())
    }, [playId])

    return {
        current, playing, time, duration, volume, rate,
        playTrack: (t: Track, list?: string[]) => {
            if (list) queue.set(list, list.indexOf(t.id))
            return playId(t.id)
        },
        toggle: () => (engine.el.paused ? void engine.play() : engine.pause()),
        seek: (t: number) => engine.seek(t),
        setVolume: (v: number) => engine.setVolume(v),
        setRate: (p: number) => engine.setRate(p),
        next: () => { const n = queue.next(); if (n) void playId(n)},
        prev: () => { const p = queue.prev(); if (p) void playId(p)}
    }

}
