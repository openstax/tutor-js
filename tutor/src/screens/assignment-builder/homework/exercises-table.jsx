import PropTypes from 'prop-types';
import React from 'react';
import { map, times } from 'lodash';
import { observer } from 'mobx-react';
import { ArbitraryHtmlAndMath } from 'shared';
import ChapterSection from '../../../components/chapter-section';
import TourRegion from '../../../components/tours/region';
import UX from '../ux';

@observer
class ExerciseTable extends React.Component {
  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
  };

  renderExerciseRow = (exercise, index) => {
    const { lo, tagString } = exercise.tags.importantInfo;
    const { chapterSection } = exercise.tags;
    let content = document.createElement('span');
    content.innerHTML = exercise.content.questions[0].stem_html;
    const images = Array.from(content.getElementsByTagName('img'));
    images.forEach((img) => {
      if (img.nextSibling) {
        img.remove();
      } else {
        if (img.parentElement) img.parentElement.remove();
      }
    });
    content = content.innerHTML;

    return (
      <tr key={`exercise-row-${index}`} data-ex-id={exercise.id}>
        <td className="exercise-number">
          {index + 1}
        </td>
        <td>
          <ChapterSection chapterSection={chapterSection} />
        </td>
        <td>
          <ArbitraryHtmlAndMath block={false} html={content} />
        </td>
        <td className="ellipses">
          {lo}
        </td>
        <td className="ellipses">
          {tagString.join(' / ')}
        </td>
      </tr>
    );
  };

  renderTutorRow(exercises, index) {
    return (
      <tr key={`exercise-row-tutor-${index}`}>
        <td className="exercise-number">
          {exercises.length + index + 1}
        </td>
        <td>
          -
        </td>
        <td>
          Tutor Selection
        </td>
        <td>
          -
        </td>
        <td>
          -
        </td>
      </tr>
    );
  }

  render() {
    const { ux: { selectedExercises, course, plan } } = this.props;
    return (
      <TourRegion
        tag="table"
        delay={4000}
        className="exercise-table"
        id="add-homework-review-sections"
        courseId={course.id}
      >
        <thead>
          <tr>
            <td />
            <td />
            <td>
              Problem Question
            </td>
            <td>
              Learning Objective
            </td>
            <td>
              Details
            </td>
          </tr>
        </thead>
        <tbody>
          {map(selectedExercises, (exercise, index) =>
            this.renderExerciseRow(exercise, index))}
          {times(plan.numTutorSelections, index =>
            this.renderTutorRow(selectedExercises, index))}
        </tbody>
      </TourRegion>
    );
  }
}


export default ExerciseTable;
