import React from 'react';
import { Testing, sinon, _ } from 'shared/specs/helpers';

import PinnedHeaderFooterCard from 'components/pinned-header-footer-card';

class TestChildComponent extends React.Component {
  static displayName = 'TestChildComponent';

  render() { return (
    <span>
      i am a test
    </span>
  ); }
}

describe('Pinned Header/Footer Card Component', function() {
  let props = null;

  beforeEach(() =>
    props =
      { cardType: 'test' }
  );


  it('renders child components', function() {
    const wrapper = shallow(
      <PinnedHeaderFooterCard {...props}>
        <TestChildComponent />
      </PinnedHeaderFooterCard>
    );
    expect(wrapper.find('TestChildComponent')).toHaveLength(1);
    return undefined;
  });


  it('sets/unsets body class', function() {
    const testClass = 'foo-test-bar';
    document.body.classList.add(testClass);
    const wrapper = mount(
      <PinnedHeaderFooterCard {...props}>
        <TestChildComponent />
      </PinnedHeaderFooterCard>
    );
    expect(document.body.classList.contains(testClass)).toBe(true);
    expect(document.body.classList.contains('test-view')).toBe(true);
    expect(document.body.classList.contains('pinned-view')).toBe(true);
    expect(document.body.classList.contains('pinned-force-shy')).to.be.false;
    wrapper.unmount();
    expect(document.body.classList.contains(testClass)).toBe(true);
    return undefined;
  });


  return it('unsets pinned-shy when scrolled down', function() {
    props.header = <span>
      i am header
    </span>;
    const wrapper = mount(
      <PinnedHeaderFooterCard {...props}>
        <TestChildComponent />
      </PinnedHeaderFooterCard>
    );
    expect(document.body.classList.contains('pinned-shy')).toBe(true);
    wrapper.setState({ offset: 400 }); // imitate react-scroll-components
    expect(document.body.classList.contains('pinned-shy')).toBe(false);
    return undefined;
  });
});
