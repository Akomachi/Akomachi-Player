const el = new Audio()
el.preload = "auto"

export const engine = {
    el,
    load(src:string) {el.src = src},
    play: () => el.play(),
    pause: () => el.pause(),
    seek(t: number) {el.currentTime = t },
    setVolume(v: number) {el.volume = v },
    on(ev: string, fn: (e: Event) => void){
        el.addEventListener(ev, fn);
        return () => el.removeEventListener(ev,fn)
    },
}