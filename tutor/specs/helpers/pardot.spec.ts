import { JSDOM } from 'jsdom'
import Pardot from '../../src/helpers/pardot'

describe('Pardot', () => {
    const dom = '<!doctype html><html><head><script src="tutor.js"></script></head><body></body></html>'

    it('attaches script to head', () => {
        const { window } = new JSDOM(dom)
        Pardot.setup(window)
        expect(window.document.getElementsByTagName('script')[0].src).toMatch('pd.js')
        expect(window.document.getElementsByTagName('script')[0].src).toMatch('http://cdn')
    })

    it('uses the https version', () => {
        const { window } = new JSDOM(dom, { url: 'https://tutor.openstax.org' })
        Pardot.setup(window)
        expect(window.document.getElementsByTagName('script')[0].src).toMatch('https://pi')
    })
})
