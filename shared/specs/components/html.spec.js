import { Testing, expect, sinon, _ } from 'shared/specs/helpers';

import Html from 'components/html';

describe('Arbitrary Html Component', function() {
  let frameProps, nestedFrameProps;
  let props = (frameProps = (nestedFrameProps = null));

  beforeEach(function() {
    props = {
      className: 'html',
      html: '<span>a test phrase</span>',
      processHtmlAndMath: sinon.spy(),
      block: true,
    };

    frameProps = {
      className: 'html',

      html: `<iframe width="560" height="315" src="https://www.youtube.com/embed/BINK6r1Wy78"
frameborder="0" allowfullscreen></iframe>`,

      processHtmlAndMath: sinon.spy(),
      block: true,
    };

    return nestedFrameProps = {
      className: 'html',

      html: `<div><iframe width="560" height="315" src="https://www.youtube.com/embed/BINK6r1Wy78"
frameborder="0" allowfullscreen></iframe></div>`,

      processHtmlAndMath: sinon.spy(),
      block: true,
    };
  });

  it('renders html', () =>
    Testing.renderComponent( Html, { props } ).then(function({ dom }) {
      expect(dom.tagName).equal('DIV');
      return expect(dom.textContent).equal('a test phrase');
    })
  );

  it('calls math processing function when rendered', () =>
    Testing.renderComponent( Html, { props } ).then(({ dom }) => {
      return expect(props.processHtmlAndMath).to.have.been.calledWith(dom);
    })
  );

  it('renders using span when block is false', function() {
    props.block = false;
    return Testing.renderComponent( Html, { props } ).then(({ dom }) => expect(dom.tagName).equal('SPAN'));
  });

  it('wraps iframes with embed classes', () =>
    Testing.renderComponent( Html, { props: frameProps } ).then(({ dom }) => expect(dom.getElementsByClassName('embed-responsive').length).equal(1))
  );

  return it('wraps nested iframes with embed classes', () =>
    Testing.renderComponent( Html, { props: nestedFrameProps } ).then(({ dom }) => expect(dom.getElementsByClassName('embed-responsive').length).equal(1))
  );
});
