let defaultProps;
import PropTypes from 'prop-types';
import React from 'react';
import ld from 'underscore';
import { TaskPlanActions, TaskPlanStore } from '../../../../src/flux/task-plan';
import ExerciseControls from '../../../../src/components/task-plan/homework/exercise-controls';

import VALID_MODEL from '../../../../api/plans/2.json';

const helper = function(props) {
  return mount(<ExerciseControls {...props} />);
};

let props = (defaultProps = {
  planId: VALID_MODEL.id,
  canAdd: true,
  canReview: true,
  addClicked: PropTypes.func,
  reviewClicked: PropTypes.func,

  sectionizerProps: {
    currentSection: '1.2',
    onSectionClick: jest.fn(),
    chapter_sections: ['1.1', '1.2', '3.1'],
  },
});


describe('Homework - Exercise Controls', function() {
  beforeEach(function() {
    TaskPlanActions.loaded(VALID_MODEL, VALID_MODEL.id);
    props = ld.mapObject(defaultProps);
    return props = ld.extend(defaultProps, {});
  });

  afterEach(() => TaskPlanActions.reset());

  xit('matches snapshot', function() {
    expect.snapshot(<ExerciseControls {...props} />).toMatchSnapshot();
  });

  it('should show add button if prop.canAdd is true', function() {
    props.canAdd = true;
    props.canReview = false;
    const c = mount(<ExerciseControls {...props} />);
    expect(c).toHaveRendered('Button[className="add-sections"]');
  });

  it('should show review button if prop.canReview is true', function() {
    props.canAdd = false;
    props.canReview = true;
    const c = mount(<ExerciseControls {...props} />);
    expect(c).toHaveRendered('Button[className="cancel-add"]');
  });
});
