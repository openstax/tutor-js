import PropTypes from 'prop-types';
import React from 'react';
import { Alert } from 'react-bootstrap';
import { isEmpty, map, compact, flatMap } from 'lodash';
import ReviewExercise from './exercise';
import TourRegion from '../../components/tours/region';
import { TaskPlanStats } from '../../models';
import NoStats from './no-stats';

function ReviewHeading(props) {
    // eslint-disable-next-line
  const { sectionLabel, title } = props;

    return (
        <h2 data-section={sectionLabel}>
            <span className="text-success">{sectionLabel}</span>
            {' '}
            {title}
        </h2>
    );

}

const NotFound = () => (
    <Alert variant="info">
    This assignment does‘t have any activity to display
    </Alert>
);

ReviewHeading.displayName = 'ReviewHeadingTracker';

export default function Review({ stats, course, period }) {

    if (!stats || isEmpty(stats.exercisesBySection)) {
        return (
            <NoStats course={course} period={period} />
        );
    }

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
                <ReviewExercise
                    course={course}
                    key={`${section}-${i}`}
                    exercise={exercise}
                />
            );
        })));
    });

    return (
        <TourRegion id="review-metrics">
            {isEmpty(stepsList) ? <NotFound /> : stepsList}
        </TourRegion>
    );
}

Review.displayName = 'Review';

Review.propTypes = {
    currentStep: PropTypes.number,
    course: PropTypes.object.isRequired,
    period: PropTypes.object.isRequired,
    stats: PropTypes.instanceOf(TaskPlanStats).isRequired,
};
