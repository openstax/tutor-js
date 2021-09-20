import { JSDOM } from 'jsdom'
import Pardot, { pardotConfig } from '../../src/helpers/pardot'

describe('Pardot', () => {
    const dom = '<!doctype html><html><head><script src="tutor.js"></script></head><body></body></html>'

    it('attaches script to head', () => {
        const { window } = new JSDOM(dom)
        Pardot.setup(window)

        expect(window.document.getElementsByTagName('script')[0].src).toMatch('pd.js')
        expect(window.document.getElementsByTagName('script')[0].src).toMatch('http://cdn')
    })

    it('matches sandbox hostname', () => {
        expect(Pardot.isSandbox('dev.tutor.sandbox.openstax.org')).toBe(true)
        expect(Pardot.isSandbox('tutor.openstax.org')).toBe(false)
    })

    it('uses the right config in a sandbox environment', () => {
        const { window } = new JSDOM(dom, { url: 'https://dev.tutor.sandbox.openstax.org' })
        Pardot.setup(window)

        const config = pardotConfig.dev
        const { piAId, piCId, piHostname } = window

        expect(piAId).toEqual(config.piAId)
        expect(piCId).toEqual(config.piCId)
        expect(piHostname).toEqual(config.piHostname)
        expect(window.document.getElementsByTagName('script')[0].src).toMatch('https://pi')
    })

    it('uses the right config in a production environment', () => {
        const { window } = new JSDOM(dom, { url: 'https://tutor.openstax.org' })
        jest.spyOn(Pardot, 'isProduction', 'get').mockReturnValueOnce(true)
        Pardot.setup(window)

        const config = pardotConfig.prod
        const { piAId, piCId, piHostname } = window

        expect(piAId).toEqual(config.piAId)
        expect(piCId).toEqual(config.piCId)
        expect(piHostname).toEqual(config.piHostname)
        expect(window.document.getElementsByTagName('script')[0].src).toMatch('https://pi')
    })
})
