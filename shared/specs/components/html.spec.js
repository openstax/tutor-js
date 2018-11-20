//import { Testing, expect, sinon, _ } from 'shared/specs/helpers';

import Html from 'components/html';

describe('Arbitrary Html Component', function() {
  let frameProps, nestedFrameProps;
  let props = (frameProps = (nestedFrameProps = null));

  beforeEach(function() {
    props = {
      className: 'html',
      html: '<span>a test phrase</span>',
      processHtmlAndMath: jest.fn(),
      block: true,
    };

    frameProps = {
      className: 'html',

      html: `<iframe width="560" height="315" src="https://www.youtube.com/embed/BINK6r1Wy78"
frameborder="0" allowfullscreen></iframe>`,

      processHtmlAndMath: jest.fn(),
      block: true,
    };

    return nestedFrameProps = {
      className: 'html',

      html: `<div><iframe width="560" height="315" src="https://www.youtube.com/embed/BINK6r1Wy78"
frameborder="0" allowfullscreen></iframe></div>`,

      processHtmlAndMath: jest.fn(),
      block: true,
    };
  });

  it('renders html', () => {
    const html = mount(<Html {...props} />);
    expect(html.html()).toMatchSnapshot();
  });

  it('calls math processing function when rendered', () => {
    mount(<Html {...props} />);
    expect(props.processHtmlAndMath).toHaveBeenCalled();
  });

  it('renders using span when block is false', function() {
    props.block = false;
    const html = mount(<Html {...props} />);
    expect(html.html()).toMatchSnapshot();
  });

});
