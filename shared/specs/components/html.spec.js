import { MemoryRouter as R } from 'react-router-dom';
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
    const html = mount(<R><Html {...props} /></R>);
    expect(html.html()).toMatchSnapshot();
    html.unmount();
  });

  it('calls math processing function when rendered', () => {
    const html = mount(<R><Html {...props} /></R>);
    expect(props.processHtmlAndMath).toHaveBeenCalled();
    html.unmount();
  });

  it('renders using span when block is false', function() {
    props.block = false;
    const html = mount(<R><Html {...props} /></R>);
    expect(html.html()).toMatchSnapshot();
    html.unmount();
  });

  it('renders without router context', function() {
    props.html='<span>this <a href="/course/1">is a link</a></span>';
    const html = mount(<Html {...props} />);
    html.unmount();
  });

});
