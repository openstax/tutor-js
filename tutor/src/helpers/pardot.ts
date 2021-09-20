import { isProd } from './production'
import { DOMWindow } from 'jsdom'

declare global {
    interface Window {
        piAId: string
        piCId: string
        piHostname: string
    }
}

const SANDBOX_HOSTNAME = /dev.tutor.sandbox.openstax.org/

export const pardotConfig = {
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


export default class Pardot {

    static getConfig(hostname: string) {
        if (this.isSandbox(hostname)) { return pardotConfig.dev }

        return this.isProduction ? pardotConfig.prod : pardotConfig.dev
    }

    static get isProduction() {
        return isProd
    }

    static isSandbox(hostname: string) {
        return SANDBOX_HOSTNAME.test(hostname)
    }

    static setup(win: Window | DOMWindow = window) {
        const doc = win.document
        const config = this.getConfig(doc.location.hostname)
        win.piAId = config.piAId
        win.piCId = config.piCId
        win.piHostname = config.piHostname

        const script = doc.createElement('script')
        const prefix = 'https:' == doc.location.protocol ? 'https://pi' : 'http://cdn'
        const src = `${prefix}.pardot.com/pd.js`
        script.src = src
        script.async = true

        const tag = doc.getElementsByTagName('script').item(0)
        tag?.parentNode?.insertBefore(script, tag)
    }
}
