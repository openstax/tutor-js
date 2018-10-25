const { typesetMath } = require('helpers/mathjax');
const FakeWindow = require('./fake-window');
import { delay } from 'lodash';

const callTypeset = (dom, window) =>
  new Promise( function( res ) {
    typesetMath(dom, window);
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
    return window.document = dom;
  });

  it('can typeset latex', function() {
    dom.innerHTML = '<div data-math="\\pi">a pi symbol</div>';
    return callTypeset(dom, window).then(() => {
      expect( window.MathJax.Hub.Typeset ).to.have.been.calledWith([dom.children[0]]);
      return expect( dom.textContent ).to.include('\\pi');
    });
  });

  // virtual dom doesn't seem to match mathjax processor's :not(.math-rendered)
  return it('typesets document with mathml is present', function() {
    dom.innerHTML = `\
<math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">
  <mrow>
    <mi>PI</mi>
  </mrow>
</math>\
`;
    return callTypeset(dom, window).then(() => {
      expect( window.MathJax.Hub.Typeset ).to.have.been.calledWith(window.document);
      return expect( dom.textContent ).to.include('PI');
    });
  });
});
