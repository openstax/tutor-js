import React from 'react';
import CenterControls from '../../../src/components/navbar/center-controls';
import { TaskActions, TaskStore } from '../../../src/flux/task';
import EnzymeContext from '../helpers/enzyme-context';

const TASK_ID = '4';

import VALID_MODEL from '../../../api/tasks/4.json';

describe('Center Controls', function() {
  let props;

  beforeEach(() => {
    TaskActions.loaded(VALID_MODEL, TASK_ID);
    props = {
      shouldShow: false,
      params: {
        id: TASK_ID,
        stepIndex: '1',
        courseId: '1',
      },
    };
  });

  afterEach(() => {
    TaskActions.reset();
  });

  it('renders with task title', () => {
    const cntrl = mount(<CenterControls {...props} shouldShow={true} />, EnzymeContext.build());
    expect(cntrl.find('.center-control-assignment').text()).toEqual(VALID_MODEL.title);
  });

  it('renders milestones link when not on milestones path', () => {
    const cntrl = mount(<CenterControls {...props} shouldShow={true} />, EnzymeContext.build());
    expect(cntrl).not.toHaveRendered('.milestones-toggle.active');
  });

  it('renders close milestones link when on milestones path', () => {
    props.params.milestones = true;
    const cntrl = mount(<CenterControls {...props} shouldShow={true} />, EnzymeContext.build());
    expect(cntrl).toHaveRendered('.milestones-toggle.active');
  });
});
