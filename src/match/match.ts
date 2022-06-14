export enum Reliability {
    HIGH = 1,
    NORMAL,
    LOW,
}

export abstract class Match {
    name: string
    id: string
    reliability: Reliability
    domains: string[]
    regex: RegExp
    abstract match(match: RegExpMatchArray): Promise<string>

    locked?: boolean
    notice?: string
}

class Evoload implements Match {
    name = 'Evoload'
    id = 'evoload'
    reliability = Reliability.NORMAL
    domains = [
        'evoload.io'
    ]
    regex = new RegExp(/.*/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        const code = window.location.pathname.split('/').slice(-1)[0]
        const response = await fetch('https://evoload.io/SecurePlayer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({code: code})
        })

        const json = await response.json()
        return json['stream']['src']
    }
}

class MCloud implements Match {
    name = 'MCloud'
    id = 'mcloud'
    reliability = Reliability.HIGH
    domains = [
        'mcloud.to'
    ]
    regex = new RegExp(/(?<=')\w+(?=';)/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        const code = window.location.pathname.split('/').slice(-1)[0]
        const response = await fetch(`https://mcloud.to/info/${code}?skey=${match[0]}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            referrer: `https://mcloud.to/embed/${code}`
        })
        const json = await response.json()
        return json['media']['sources'][0]['file']
    }
}

class Mixdrop implements Match {
    name = 'Mixdrop'
    id = 'mixdrop'
    reliability = Reliability.HIGH
    domains = [
        'mixdrop.co'
    ]
    regex = new RegExp(/(?<=\|)\w{2,}/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return `https://a-${match[1]}.${match[4]}.${match[5]}/v/${match[2]}.${match[6]}?s=${match[12]}&e=${match[13]}`
    }
}

class Newgrounds implements Match {
    name = 'Newgrounds'
    id = 'newgrounds'
    reliability = Reliability.HIGH
    domains = [
        'newgrounds.com'
    ]
    regex = new RegExp(/.*/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        let id = window.location.pathname.split('/').slice(-1)[0]
        let response = await fetch(`https://www.newgrounds.com/portal/video/${id}`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        let json = await response.json()
        return decodeURI(json['sources'][Object.keys(json['sources'])[0]][0]['src'])
    }
}

class Streamtape implements Match {
    name = 'Streamtape'
    id = 'streamtape'
    reliability = Reliability.NORMAL
    domains = [
        'streamtape.com'
    ]
    regex = new RegExp(/id=\S*(?=')/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return `https://streamtape.com/get_video?${match[0]}`
    }
}

class Streamzz implements Match {
    name = 'Streamzz'
    id = 'streamzz'
    reliability = Reliability.NORMAL
    domains = [
        'streamzz.to'
    ]
    regex = new RegExp(/https?:\/\/get.streamz.tw\/getlink-\w+\.dll/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return match[0]
    }
}

class TheVideoMe implements Match {
    name = 'TheVideoMe'
    id = 'thevideome'
    reliability = Reliability.NORMAL
    domains = [
        'thevideome.com'
    ]
    regex = new RegExp(/(?<=\|)\w{2,}/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return `https://thevideome.com/${match[5]}.mp4`
    }
}

class Upstream implements Match {
    name = 'Upstream'
    id = 'upstream'
    reliability = Reliability.NORMAL
    domains = [
        'upstream.to'
    ]
    regex = new RegExp(/(?<=\|)\w{2,}/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return `https://${match[49]}.upstreamcdn.co/hls/${match[148]}/master.m3u8`
    }
}

class Vidlox implements Match {
    name = 'Vidlox'
    id = 'vidlox'
    reliability = Reliability.NORMAL
    domains = [
        'vidlox.me'
    ]
    regex = new RegExp(/(?<=\[")\S+?(?=")/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return match[0]
    }
}

class Vidstream implements Match {
    name = 'Vidstream'
    id = 'vidstream'
    reliability = Reliability.LOW
    domains = [
        'vidstream.pro'
    ]
    regex = new RegExp(/(?<=')\w+(?=';)/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        const code = window.location.pathname.split('/').slice(-1)[0]
        const response = await fetch(`https://vidstream.pro/info/${code}?skey=${match[0]}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            referrer: `https://vidstream.pro/embed/${code}`
        })
        const json = await response.json()
        return json['media']['sources'][0]['file']
    }
}

class Vidoza implements Match {
    name = 'Vidoza'
    id = 'vidoza'
    reliability = Reliability.NORMAL
    domains = [
        'vidoza.net'
    ]
    regex = new RegExp(/(?<=src:(\s*)?")\S*(?=")/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return match[0]
    }
}

class Vivo implements Match {
    name = 'Vivo'
    id = 'vivo'
    reliability = Reliability.HIGH
    domains = [
        'vivo.st',
        'vivo.sx'
    ]
    regex = new RegExp(/(?<=source:\s')(\S+)(?=')/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return this.rot47(decodeURIComponent(match[0]))
    }

    // decrypts a string with the rot47 algorithm (https://en.wikipedia.org/wiki/ROT13#Variants)
    rot47(encoded: string): string {
        const s = []
        for(let i = 0; i < encoded.length; i++) {
            const j = encoded.charCodeAt(i)
            if((j >= 33) && (j <= 126)) {
                s[i] = String.fromCharCode(33+((j+ 14)%94))
            } else {
                s[i] = String.fromCharCode(j)
            }
        }
        return s.join('')
    }
}

class Voe implements Match {
    name = 'Voe'
    id = 'voe'
    reliability = Reliability.HIGH
    domains = [
        'voe.sx',
        'voeunblk.com'
    ]
    regex = new RegExp(/https?:\/\/\S*m3u8(?=")/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return match[0]
    }
}

class Vupload implements Match {
    name = 'Vupload'
    id = 'vupload'
    reliability = Reliability.HIGH
    domains = [
        'vupload.com'
    ]
    regex = new RegExp(/(?<=src:\s?").+?(?=")/gm)

    async match(match: RegExpMatchArray): Promise<string> {
        return match[0]
    }
}

export const matches = [
    new Evoload(),
    new MCloud(),
    new Mixdrop(),
    new Newgrounds(),
    new Streamtape(),
    new Streamzz(),
    new TheVideoMe(),
    new Upstream(),
    new Vidlox(),
    new Vidoza(),
    new Vivo(),
    new Voe(),
    new Vupload()
]