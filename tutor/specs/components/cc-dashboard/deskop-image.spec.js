import React from 'react';
import ld from 'underscore';

import Courses from '../../../src/models/courses-map';

import COURSE from '../../../api/courses/1.json';
const COURSE_ID = '1';

import Image from '../../../src/components/cc-dashboard/desktop-image';
import Context from '../helpers/enzyme-context';


describe('CC Dashboard desktop image', function() {
  let props = {};
  beforeEach(function() {
    Courses.bootstrap([COURSE], { clear: true });
    return props =
      { courseId: COURSE_ID };
  });

  return it('list a truncated course title', function() {
    Courses.get(COURSE_ID).name = 'A long name that should be truncated somewhere';
    const image = shallow(<Image {...props} />, Context.build());
    expect(image).toHaveRendered('text[className="course-name"]');
    expect(image.find('text[className="course-name"]').text()).toEqual('A long name that should be truncated so…');
    return undefined;
  });
});
