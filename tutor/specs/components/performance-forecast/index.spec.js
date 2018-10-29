import { React, SnapShot } from 'helpers';
import { bootstrapCoursesList } from '../../courses-test-data';

import ReactTestUtils from 'react-addons-test-utils';
import { Promise } from 'es6-promise';
import { routerStub, commonActions } from '../helpers/utilities';


import PerformanceForecast from '../../../src/flux/performance-forecast';
import Guide from '../../../src/components/performance-forecast/guide';

import GUIDEldDATA from '../../../api/courses/1/guide.json';
const COURSE_ID = '1'; // needs to be a string, that's what LoadableItem expects


describe('Learning Guide', function() {
  let props;

  beforeEach(function() {
    PerformanceForecast.Student.actions.loaded(GUIDE_DATA, COURSE_ID);
    bootstrapCoursesList();
    props = {
      courseId: COURSE_ID,
      allSections: [],
      weakerTitle: 'weaker',
    };
  });


  it('renders panel for each chapter', function() {
    const component = SnapShot.create(<Guide {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
