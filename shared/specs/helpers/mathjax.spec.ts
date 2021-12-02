import { typesetMath, } from '../../src/helpers/mathjax'
import FakeWindow from './fake-window'
import { delay } from 'lodash'

const callTypeset = (dom: Document, window: Window) =>
    new Promise(function(res) {
        typesetMath(window)
        return delay(() => res(dom), 190)
    })


describe('Mathjax Helper', () => {
    let dom: any = null
    let window: any = null

    beforeEach(function() {
        dom = document.createElement('div')
        window = new FakeWindow
        window.MathJax = {
            typesetPromise: jest.fn(() => Promise.resolve()),
        }
        window.document = dom
    })

    it('can typeset latex', async () => {
        dom.innerHTML = '<div data-math="\\pi">a pi symbol</div>'
        return callTypeset(dom, window).then(() => {
            expect(window.MathJax.typesetPromise).toHaveBeenCalledWith([dom, [dom.children[0]]])
            return expect(dom.textContent).toContain('\\pi')
        })
    })

    // virtual dom doesn't seem to match mathjax processor's :not(.math-rendered)
    it('typesets document with mathml is present', async () => {
        dom.innerHTML = `\
<math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">
  <mrow>
    <mi>PI</mi>
  </mrow>
</math>\
    `
        return callTypeset(dom, window).then(() => {
            expect(window.MathJax.typesetPromise).toHaveBeenCalledWith([window.document, []])
            return expect(dom.textContent).toContain('PI')
        })
    })
})
