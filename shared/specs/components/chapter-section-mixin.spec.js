import React from 'react';
import createReactClass from 'create-react-class';
import { Testing, expect, sinon, _ } from 'shared/specs/helpers';

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

  beforeEach(() =>
    props = {
      section: [1, 2],
      separator: '.',
    }
  );

  it('can use custom separator', function() {
    props.separator = '-';
    return Testing.renderComponent( Component, { props } ).then(({ dom }) => expect(dom.textContent).equal('1-2'));
  });

  return it('can render chapter/section thats a string', function() {
    props.section = '3.4';
    return Testing.renderComponent( Component, { props } ).then(({ dom }) => expect(dom.textContent).equal('3.4'));
  });
});
