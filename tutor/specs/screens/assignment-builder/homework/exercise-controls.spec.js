let defaultProps;
import PropTypes from 'prop-types';
import React from 'react';
import ld from 'underscore';
import { TaskPlanActions  } from '../../../../src/flux/task-plan';
import ExerciseControls from '../../../../src/screens/assignment-builder/homework/exercise-controls';

import VALID_MODEL from '../../../../api/plans/2.json';

let props = (defaultProps = {
  planId: VALID_MODEL.id,
  canAdd: true,
  canReview: true,
  unDocked: true,
  addClicked: PropTypes.func,
  reviewClicked: PropTypes.func,
  setSecondaryTopControls: jest.fn(),
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
    props.setSecondaryTopControls = jest.fn();
    return props = ld.extend(defaultProps, {});
  });

  afterEach(() => TaskPlanActions.reset());

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
