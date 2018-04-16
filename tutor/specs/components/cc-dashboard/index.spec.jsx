import React from 'react';

jest.mock('../../../src/helpers/router');
import Router from '../../../src/helpers/router';
import SnapShot from 'react-test-renderer';
import { extend, defer, pick } from 'lodash';
import Context from '../helpers/enzyme-context';

import { CCDashboardStore, CCDashboardActions } from '../../../src/flux/cc-dashboard';
import Courses from '../../../src/models/courses-map';
import { Testing } from '../helpers/component-testing';

import DashboardShell from '../../../src/components/cc-dashboard';
import BaseModel from '../../../api/courses/1/cc/dashboard.json';
const ExtendBaseStore = props => extend({}, BaseModel, props);

const BlankCourse = ExtendBaseStore({course:{ periods: [], name: "Blank!"}});

const IDS = {
  BLANK: '0',
  BASE: '1',
};

describe('Concept Coach Dashboard Shell', function() {
  beforeEach(function(done) {
    Router.currentQuery.mockReturnValue({});
    const CourseObj = extend({}, pick(BlankCourse.course, 'name', 'teachers'), { is_concept_coach: true });
    CCDashboardActions.loaded(BlankCourse, IDS.BLANK);
    CCDashboardActions.loaded(BaseModel, IDS.BASE);
    Courses.bootstrap([ extend({ id: IDS.BLANK }, CourseObj)]);
    Courses.bootstrap([ extend({ id: IDS.BASE }, CourseObj)]);
    defer(done);
  });

  it('displays the help page when there are no periods', function() {
    Router.currentParams.mockReturnValue({ courseId: IDS.BLANK });
    const wrapper = mount(<DashboardShell />, Context.build());
    expect(wrapper).toHaveRendered('.cc-dashboard-help');
  });

  it('renders dashboard when there are periods', function() {
    Router.currentParams.mockReturnValue({ courseId: IDS.BASE });
    const wrapper = mount(<DashboardShell />, Context.build());
    expect(wrapper).toHaveRendered('.cc-dashboard');
    expect(wrapper).not.toHaveRendered('.cc-dashboard-help');
  });
});
