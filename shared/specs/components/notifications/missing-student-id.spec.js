import React from 'react';
import SnapShot from 'react-test-renderer';

import MissingStudentId from '../../../src/components/notifications/missing-student-id';

describe('Notifications MissingStudentId notice', function() {
  let props = null;

  beforeEach(() =>
    props = {
      callbacks: {
        onAdd: jest.fn(),
      },

      notice: {
        role: {
          id: '1',
          type: 'student',
          joined_at: '2012-01-01',
          latest_enrollment_at: '2012-01-01',
        },

        course: {
          id: '1',
        },
      },
    }
  );

  it('renders and matches snapshot', function() {
    const component = SnapShot.create(<MissingStudentId {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('calls onAdd callback', function() {
    const wrapper = shallow(<MissingStudentId {...props} />);
    wrapper.find('a.action').simulate('click');
    expect(props.callbacks.onAdd).toHaveBeenCalled();
  });
});
