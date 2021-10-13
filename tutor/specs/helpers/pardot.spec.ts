import { JSDOM } from 'jsdom'
import Pardot, { pardotConfig } from '../../src/helpers/pardot'

describe('Pardot', () => {
    const dom = '<!doctype html><html><head><script src="tutor.js"></script></head><body></body></html>'

    it('skips localhost', () => {
        const { window } = new JSDOM(dom)
        expect(Pardot.setup(window)).toBe(undefined)
        expect(window.document.getElementsByTagName('script')[0].src).not.toMatch('pd.js')
    })

    it('matches hostnames', () => {
        expect(Pardot.isProductionHostname('dev.tutor.sandbox.openstax.org')).toBe(false)
        expect(Pardot.isProductionHostname('tutor.openstax.org')).toBe(true)
        expect(Pardot.isNonOpenStaxHostname('localhost')).toBe(true)
        expect(Pardot.isNonOpenStaxHostname('openstax.org')).toBe(false)
    })

    it('uses the correct config in a demo environment', () => {
        let { window } = new JSDOM(dom, { url: 'http://dev.tutor.sandbox.openstax.org' })
        Pardot.setup(window)

        const config = pardotConfig.demo
        const { piAId, piCId, piHostname } = window

        expect(piAId).toEqual(config.piAId)
        expect(piCId).toEqual(config.piCId)
        expect(piHostname).toEqual(config.piHostname)
        expect(window.document.getElementsByTagName('script')[0].src).toMatch('pd.js')
        expect(window.document.getElementsByTagName('script')[0].src).toMatch('http://cdn')

        window = new JSDOM(dom, { url: 'http://qa.tutor.openstax.org' }).window
        Pardot.setup(window)
        expect(window.piAId).toEqual(config.piAId)
    })

    it('uses the correct config in a production environment', () => {
        const { window } = new JSDOM(dom, { url: 'https://tutor.openstax.org' })
        jest.spyOn(Pardot, 'isProductionEnvironment', 'get').mockReturnValue(true)
        Pardot.setup(window)

        const config = pardotConfig.prod
        const { piAId, piCId, piHostname } = window

        expect(piAId).toEqual(config.piAId)
        expect(piCId).toEqual(config.piCId)
        expect(piHostname).toEqual(config.piHostname)
        expect(window.document.getElementsByTagName('script')[0].src).toMatch('pd.js')
        expect(window.document.getElementsByTagName('script')[0].src).toMatch('https://pi')
    })

    it('tracks', () => {
        const url = 'https://tutor.openstax.org/courses/1'
        const { window } = new JSDOM(dom, { url: url })
        window.piTracker = jest.fn()
        Pardot.track(window)
        expect(window.piTracker).toHaveBeenCalledWith(url)
    })
})
