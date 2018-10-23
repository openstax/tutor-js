import { Testing, expect, sinon, _, ReactTestUtils } from 'shared/specs/helpers';

import React from 'react';

import CcConflictMessage from '../../../src/components/enroll/cc-conflict-message';

describe('CcConflictMessage Component', () =>

  it('displays the CC conflict message', function() {
    const courseEnrollmentStore = {
      conflictDescription() { return 'Test Course'; },
      conflictTeacherNames() { return 'Instructors: Jane Smith and John Smith'; },
    };
    const wrapper = shallow(<CcConflictMessage courseEnrollmentStore={courseEnrollmentStore} />);
    expect(wrapper.text()).to.eq(
      'We will remove you from Test Course with Instructors: Jane Smith and John Smith. If you want to stay enrolled in the OpenStax Concept Coach for that course, contact us.'
    );
    return undefined;
  })
);
