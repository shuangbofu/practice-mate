export function getProgressColor(index: number, size: number): string {
    const percent = index / size
    if (percent < 0.5) {
        const ratio = percent / 0.5
        return interpolateColor('#ff4a58', '#10B459', ratio)
    } else {
        const ratio = (percent - 0.5) / 0.5
        return interpolateColor('#10B459', '#8B5CF6', ratio)
    }
}
function interpolateColor(from: string, to: string, ratio: number): string {
    const hexToHsl = (hex: string): [number, number, number] => {
        const [r, g, b] = hex.match(/\w\w/g)!.map(x => parseInt(x, 16) / 255)
        const max = Math.max(r, g, b), min = Math.min(r, g, b)
        let h = 0, s = 0, l = (max + min) / 2

        if (max !== min) {
            const d = max - min
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break
                case g: h = (b - r) / d + 2; break
                case b: h = (r - g) / d + 4; break
            }
            h /= 6
        }

        return [h * 360, s, l]
    }

    const hslToRgb = (h: number, s: number, l: number): string => {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1 / 6) return p + (q - p) * 6 * t
            if (t < 1 / 2) return q
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
            return p
        }

        h = h / 360
        let r, g, b
        if (s === 0) {
            r = g = b = l
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s
            const p = 2 * l - q
            r = hue2rgb(p, q, h + 1 / 3)
            g = hue2rgb(p, q, h)
            b = hue2rgb(p, q, h - 1 / 3)
        }

        return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`
    }

    const [h1, s1, l1] = hexToHsl(from)
    const [h2, s2, l2] = hexToHsl(to)

    let dh = h2 - h1
    if (dh > 180) dh -= 360
    if (dh < -180) dh += 360

    const h = h1 + dh * ratio
    const s = (s1 + (s2 - s1) * ratio) * 0.8
    const l = (l1 + (l2 - l1) * ratio) * 0.9

    return hslToRgb(h, s, l)
}

export const doubleClick = (onClick: (e: any, double: boolean) => void, delay = 250) => {
    let timer: number | null = null

    return (e: any) => {
        if (timer !== null) {
            // 双击
            clearTimeout(timer)
            timer = null
            onClick(e, true)
        } else {
            // 第一次点击
            timer = window.setTimeout(() => {
                onClick(e, false)
                timer = null
            }, delay)
        }
    }
}

export const range = (n: number, m: number) => {
    if (n > m) return []; // 如果起始值大于结束值，返回空数组
    return Array.from({ length: m - n + 1 }, (_, i) => i + n);
};
