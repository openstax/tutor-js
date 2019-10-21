import PropTypes from 'prop-types';
import React from 'react';
import { times } from 'lodash';
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

  renderExercise = (rows, exercise) => {
    return rows.concat(
      exercise.content.questions.map((question, qIndex) => {
        return this.renderExerciseQuestion({ exercise, question, index: rows.length + qIndex });
      })
    );
  }

  renderExerciseQuestion = ({ exercise, index, question }) => {
    const { lo, tagString } = exercise.tags.importantInfo;
    const { chapterSection } = exercise.tags;
    let content = document.createElement('span');
    content.innerHTML = question.stem_html;
    Array.from(content.getElementsByTagName('img, iframe')).forEach((el) => {
      if (el.nextSibling) {
        el.remove();
      } else {
        if (el.parentElement) el.parentElement.remove();
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
          {selectedExercises.reduce(this.renderExercise, [])}
          {times(plan.numTutorSelections, index =>
            this.renderTutorRow(selectedExercises, index))}
        </tbody>
      </TourRegion>
    );
  }
}


export default ExerciseTable;
