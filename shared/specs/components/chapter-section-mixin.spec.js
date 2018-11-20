import React from 'react';
import createReactClass from 'create-react-class';

import ChapterSection from 'components/chapter-section-mixin';

const Component = createReactClass({
  displayName: 'Component',
  mixins: [ChapterSection],

  render() {
    return (
      <span>
        {this.sectionFormat(this.props.section, this.props.separator)}
      </span>
    );
  },
});

describe('Chapter Section Mixin', function() {
  let props = null;

  beforeEach(() => {
    props = {
      section: [1, 2],
      separator: '.',
    };
  });

  it('can use custom separator', function() {
    props.separator = '-';
    const cs = mount(<Component {...props} />);
    expect(cs.text()).toMatch('1-2');
    cs.unmount();
  });

  it('can render chapter/section thats a string', function() {
    props.section = '3.4';
    const cs = mount(<Component {...props} />);
    expect(cs.text()).toMatch('3.4');
    cs.unmount();
  });

});
