import { React, ld } from '../../../helpers';

import MiniEditor from '../../../../src/components/task-plan/mini-editor';
import { TaskPlanActions } from '../../../../src/flux/task-plan';

import COURSE from '../../../../api/courses/1.json';
const COURSE_ID = '1';

import DATA from '../../../../api/courses/1/dashboard';
const PLAN = _.findWhere(DATA.plans, { id: '7' });

describe('TaskPlan MiniEditor wrapper', function() {
  let props = {};
  beforeEach(() =>
    props = {
      courseId: '1',
      planId:   '42',
      findPopOverTarget: jest.fn(),
      onHide: jest.fn(),
      position: { x: 100, y: 100 },
    });

  return it('renders with loadable', function() {
    const wrapper = shallow(React.createElement(MiniEditor, Object.assign({}, props )));
    expect(wrapper.find('LoadableItem[id="42"]')).length.to.be(1);
    return undefined;
  });
});
