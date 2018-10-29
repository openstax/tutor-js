let defaultProps;
import { expect } from 'chai';
import PropTypes from 'prop-types';
import React from 'react';
import ld from 'underscore';
import { sinon } from '../../../helpers';


import { TaskPlanActions, TaskPlanStore } from '../../../../src/flux/task-plan';
import ExerciseControls from '../../../../src/components/task-plan/homework/exercise-controls';

import VALIDldMODEL from '../../../../api/plans/2.json';

const helper = function(props) {
  const html = React.renderToString(<ExerciseControls {...props} />);
  const div = document.createElement('div');
  div.innerHTML = html;
  return div;
};

let newProps = (defaultProps = {
  planId: VALID_MODEL.id,
  canAdd: true,
  canReview: true,
  addClicked: PropTypes.func,
  reviewClicked: PropTypes.func,

  sectionizerProps: {
    currentSection: '1.2',
    onSectionClick: sinon.spy(),
    chapter_sections: ['1.1', '1.2', '3.1'],
  },
});


xdescribe('Homework - Exercise Controls', function() {
  beforeEach(function() {
    TaskPlanActions.loaded(VALID_MODEL, VALID_MODEL.id);
    newProps = _.mapObject(defaultProps);
    return newProps = _.extend(defaultProps, {});
  });

  afterEach(() => TaskPlanActions.reset());

  it('can render correct amount of exercises', function() {
    const node = helper(newProps);
    const selected = VALID_MODEL.settings.exercise_ids.length;
    const dynamic = VALID_MODEL.settings.exercises_count_dynamic;
    const total = selected + dynamic;

    expect(node.querySelector('.total h2').innerHTML).to.be.equal(total.toString());
    return expect(node.querySelector('.num.mine h2').innerHTML).to.be.equal(selected.toString());
  });

  it('should show add button if prop.canAdd is true', function() {
    newProps.canAdd = true;
    newProps.canReview = false;

    const node = helper(newProps);
    return expect(node.querySelector('.-add-exercises')).to.not.be.null;
  });

  return it('should show review button if prop.canReview is true', function() {
    newProps.canAdd = false;
    newProps.canReview = true;

    const node = helper(newProps);
    return expect(node.querySelector('.-review-exercises')).to.not.be.null;
  });
});
