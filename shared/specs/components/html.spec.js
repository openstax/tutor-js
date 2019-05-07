//import { Testing, expect, sinon, _ } from 'shared/specs/helpers';

import Html from 'components/html';

describe('Arbitrary Html Component', function() {
  let props;

  beforeEach(function() {
    props = {
      className: 'html',
      html: '<span>a test phrase</span>',
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
