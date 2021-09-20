import { JSDOM } from 'jsdom'
import Pardot, { pardotConfig } from '../../src/helpers/pardot'

describe('Pardot', () => {
    const dom = '<!doctype html><html><head><script src="tutor.js"></script></head><body></body></html>'

    it('skips localhost', () => {
        const { window } = new JSDOM(dom)
        expect(Pardot.setup(window)).toBe(undefined)
    })

    it('matches sandbox hostname', () => {
        expect(Pardot.isSandbox('dev.tutor.sandbox.openstax.org')).toBe(true)
        expect(Pardot.isSandbox('tutor.openstax.org')).toBe(false)
    })

    it('uses the correct config in a sandbox environment', () => {
        const { window } = new JSDOM(dom, { url: 'http://dev.tutor.sandbox.openstax.org' })
        Pardot.setup(window)

        const config = pardotConfig.sand
        const { piAId, piCId, piHostname } = window

        expect(piAId).toEqual(config.piAId)
        expect(piCId).toEqual(config.piCId)
        expect(piHostname).toEqual(config.piHostname)
        expect(window.document.getElementsByTagName('script')[0].src).toMatch('pd.js')
        expect(window.document.getElementsByTagName('script')[0].src).toMatch('http://cdn')
    })

    it('uses the correct config in a production environment', () => {
        const { window } = new JSDOM(dom, { url: 'https://tutor.openstax.org' })
        jest.spyOn(Pardot, 'isProduction', 'get').mockReturnValue(true)
        Pardot.setup(window)

        const config = pardotConfig.prod
        const { piAId, piCId, piHostname } = window

        expect(piAId).toEqual(config.piAId)
        expect(piCId).toEqual(config.piCId)
        expect(piHostname).toEqual(config.piHostname)
        expect(window.document.getElementsByTagName('script')[0].src).toMatch('pd.js')
        expect(window.document.getElementsByTagName('script')[0].src).toMatch('https://pi')
    })
})
