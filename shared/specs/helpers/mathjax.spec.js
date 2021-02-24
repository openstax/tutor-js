import { typesetMath } from '../../src/helpers/mathjax';
import FakeWindow from './fake-window';
import { delay } from 'lodash';

const callTypeset = (dom, window) =>
    new Promise( function( res ) {
        typesetMath(window);
        return delay(() => res(dom)
            , 190);
    })
;


describe('Mathjax Helper', function() {
    let dom = null;
    let window = null;

    beforeEach(function() {
        dom = document.createElement('div');
        window = new FakeWindow;
        window.MathJax = {
            Hub: {
                Typeset: jest.fn(),
                Queue: (...args) => args.map(arg => arg()),
            },
        };
        window.document = dom;
    });

    it('can typeset latex', function() {
        dom.innerHTML = '<div data-math="\\pi">a pi symbol</div>';
        return callTypeset(dom, window).then(() => {
            expect( window.MathJax.Hub.Typeset ).toHaveBeenCalledWith([dom.children[0]]);
            return expect( dom.textContent ).toContain('\\pi');
        });
    });

    // virtual dom doesn't seem to match mathjax processor's :not(.math-rendered)
    it('typesets document with mathml is present', function() {
        dom.innerHTML = `\
<math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">
  <mrow>
    <mi>PI</mi>
  </mrow>
</math>\
    `;
        return callTypeset(dom, window).then(() => {
            expect( window.MathJax.Hub.Typeset ).toHaveBeenCalledWith(window.document);
            return expect( dom.textContent ).toContain('PI');
        });
    });
});
