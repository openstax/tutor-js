import React from 'react';
import chronokinesis from 'chronokinesis';
import moment from 'moment-timezone';
import CenterControls from '../../../src/components/navbar/center-controls';
import { TaskActions, TaskStore } from '../../../src/flux/task';
import EnzymeContext from '../helpers/enzyme-context';
import { Wrapper, SnapShot } from '../helpers/component-testing';
import Router from '../../../src/helpers/router';

jest.mock('../../../src/helpers/router');

const TASK_ID = '4';

import VALID_MODEL from '../../../api/tasks/4.json';

describe('Center Controls', function() {
  let props;

  beforeEach(() => {
    moment.tz.setDefault('America/Chicago');
    TaskActions.loaded(VALID_MODEL, TASK_ID);
    chronokinesis.travel(new Date('2017-08-16T21:29:21.411Z'));
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
    chronokinesis.reset();
    moment.tz.setDefault();
  });


  it('matches snapshot', () => {
    Router.makePathname.mockImplementation(() =>
      '/course/1/task/4/step/1/milestones'
    );
    expect(
      SnapShot.create(<Wrapper {...props} shouldShow={true} _wrapped_component={CenterControls} />).toJSON()
    ).toMatchSnapshot();
  });

  it('hides itself when not on milestones path', () => {
    Router.currentMatch.mockImplementation(() => ({
      entry: { name: 'myCourses' },
    }));
    const cntrl = mount(<CenterControls {...props} />, EnzymeContext.build());
    cntrl.setProps({});
    expect(cntrl).not.toHaveRendered('.milestones-toggle');
  });

  it('renders milestones link when not on milestones path', () => {
    Router.currentMatch.mockImplementation(() => ({
      entry: { name: 'viewTaskStep' },
    }));
    const cntrl = mount(<CenterControls {...props} />, EnzymeContext.build());
    expect(cntrl).toHaveRendered('.milestones-toggle');
    expect(cntrl).not.toHaveRendered('.milestones-toggle.active');
  });

  it('renders close milestones link when on milestones path', () => {
    Router.currentMatch.mockImplementation(() => ({
      entry: { name: 'viewTaskStepMilestones' },
    }));
    props.params.milestones = true;
    const cntrl = mount(<CenterControls {...props} />, EnzymeContext.build());
    expect(cntrl).toHaveRendered('.milestones-toggle.active');
  });

});
