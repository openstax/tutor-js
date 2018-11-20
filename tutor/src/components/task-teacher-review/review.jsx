import PropTypes from 'prop-types';
import React from 'react';
import { omit, map, compact, flatMap, extend, isNil } from 'lodash';
import ReviewExercise from './exercise';
import TourRegion from '../tours/region';

import { Stats } from '../../models/task-plan/stats';

function ReviewHeading(props) {
  const { sectionLabel, title } = props;

  return (
    <h2 data-section={sectionLabel}>
      <span className="text-success">{sectionLabel}</span>
      {' '}
      {title}
    </h2>
  );

}

ReviewHeading.displayName = 'ReviewHeadingTracker';

export default function Review(props) {
  const { stats } = props;
  const stepsList = flatMap(stats.exercisesBySection, (exercises, section) => {
    const steps = [
      <ReviewHeading
        sectionLabel={section}
        key={`${section}-heading`}
        title={exercises[0].page.title}
      />,
    ];
    return steps.concat(compact(map(exercises, (exercise, i) => {
      if (!exercise.content) { return null; }
      return (
        <ReviewExercise key={`${section}-${i}`} exercise={exercise} />
      );
    })));
  });

  return (
    <TourRegion id="review-metrics">
      {stepsList}
    </TourRegion>
  );
}

Review.displayName = 'Review';

Review.propTypes = {
  currentStep: PropTypes.number,
  stats: PropTypes.instanceOf(Stats).isRequired,
};
