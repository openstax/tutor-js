import { isProd } from './production'
import { DOMWindow } from 'jsdom'

declare global {
    interface Window {
        piAId: string
        piCId: string
        piHostname: string
    }
}

export default class Pardot {
    static configs = {
        dev: {
            piAId: '309222',
            piCId: '2313',
            piHostname: 'pi.demo.pardot.com',
        },
        prod: {
            piAId: '219812',
            piCId: '1120',
            piHostname: 'pi.pardot.com',
        },
    };

    static get config() {
        return isProd ? this.configs.prod : this.configs.dev
    }

    static setup(win: Window | DOMWindow = window) {
        const doc = win.document
        const script = doc.createElement('script')
        const prefix = 'https:' == doc.location.protocol ? 'https://pi' : 'http://cdn'
        const src = `${prefix}.pardot.com/pd.js`
        script.src = src
        script.async = true

        win.piAId = this.config.piAId
        win.piCId = this.config.piCId
        win.piHostname = this.config.piHostname

        const tag = doc.getElementsByTagName('script').item(0)
        tag?.parentNode?.insertBefore(script, tag)
    }
}
