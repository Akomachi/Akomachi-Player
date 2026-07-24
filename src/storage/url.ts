import { db } from "./db.ts"

const cache = new Map<string, string>();

export async function coverURL(id: string): Promise<string | null> {
    const hit = cache.get(id)
    if(hit) return hit
    const blob = await (await db()).get("covers", id)
    if (!blob) return null
    const url = URL.createObjectURL(blob)
    cache.set(id, url)
    return url
}

export function releaseAll(){
    for (const url of cache.values()) URL.revokeObjectURL(url)
    cache.clear()
} 