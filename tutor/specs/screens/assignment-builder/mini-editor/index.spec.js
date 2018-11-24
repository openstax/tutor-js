import { React, Factory } from '../../../helpers';

import MiniEditor from '../../../../src/screens/assignment-builder/mini-editor';

describe('TaskPlan MiniEditor wrapper', function() {
  let props = {};
  beforeEach(() =>
    props = {
      course: Factory.course(),
      planId:   '42',
      findPopOverTarget: jest.fn(),
      onHide: jest.fn(),
      position: { x: 100, y: 100 },
    });

  it('renders with loadable', function() {
    const wrapper = shallow(React.createElement(MiniEditor, Object.assign({}, props )));
    expect(wrapper.find('LoadableItem[id="42"]')).toHaveLength(1);
  });
});
