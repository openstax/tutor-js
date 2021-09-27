import { isProd } from './production'
import { DOMWindow } from 'jsdom'

declare global {
    interface Window {
        piAId: string
        piCId: string
        piHostname: string
    }
}

const PRODUCTION_HOSTNAME = /^tutor.openstax.org/

export const pardotConfig = {
    demo: {
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

    static get config() {
        return this.isProduction ? pardotConfig.prod : pardotConfig.demo
    }

    static get isProduction() {
        return this.isProductionEnvironment && this.isProductionHostname
    }

    static get isProductionEnvironment() {
        // checks NODE_ENV, here for mocking
        return isProd
    }

    static isProductionHostname(hostname: string) {
        return PRODUCTION_HOSTNAME.test(hostname)
    }

    static isNonOpenStaxHostname(hostname: string) {
        return !/openstax.org/.test(hostname)
    }

    static setup(win: Window | DOMWindow = window) {
        const doc = win.document
        const hostname = doc.location.hostname

        if (this.isNonOpenStaxHostname(hostname)) {
            return
        }

        win.piAId = this.config.piAId
        win.piCId = this.config.piCId
        win.piHostname = this.config.piHostname

        const script = doc.createElement('script')
        const prefix = 'https:' == doc.location.protocol ? 'https://pi' : 'http://cdn'
        const src = `${prefix}.pardot.com/pd.js`
        script.src = src
        script.async = true

        const tag = doc.getElementsByTagName('script').item(0)
        tag?.parentNode?.insertBefore(script, tag)
    }
}
