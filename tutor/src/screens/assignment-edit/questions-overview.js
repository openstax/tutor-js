import React from 'react';
import { PropTypes, styled, observer } from 'vendor';
import { times, get } from 'lodash';
import { colors } from 'theme';
import S from '../../helpers/string';
import ChapterSection from '../../components/chapter-section';

const StyledOverview = styled.div`
  margin: 2rem 3.8rem;

  table {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    border-collapse: collapse;
  }

  thead {
    background: ${colors.neutral.gray};
    color: #fff;
    font-size: 1.8rem;
    th {
      height: 40px;

    }
  }

  tbody {
    tr td {
      border: 1px solid ${colors.neutral.light};
      font-size: 1.2rem;

      &:first-child {
        border-left: 0px;
      }

      &:last-child {
        border-right: 0px;
      }
    }

    tr:nth-child(even) {
      background: white;
    }

    tr:nth-child(odd) {
      background: ${colors.neutral.lightest};
    }
  }

  td.exercise-number {
    font-size: 1.8rem;
    text-align: center;
  }

  td.ellipses {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 250px;

    *:first-child {
      margin: 0;
    }
    * + * {
      display: none;
    }

    img {
      display: none;
    }

    span p:first-child {
      display: inline;
    }
  }

  td {
    padding: 5px;
  }
`;


@observer
class QuestionsOverview extends React.Component {
  static propTypes = {
    ux: PropTypes.object.isRequired,
  };

  renderExercise = (rows, exercise) => {
    return rows.concat(
      exercise.content.questions.map((question, qIndex) => {
        return this.renderExerciseQuestion({ exercise, question, index: rows.length + qIndex });
      })
    );
  }

  renderExerciseQuestion = ({ exercise, index }) => {
    const { chapterSection, dok, blooms, lo } = exercise.tags.important;
    const points = get(this.props.ux.plan.settings, `exercises[${index}].points`, 0);

    return (
      <tr key={`exercise-row-${index}`} data-ex-id={exercise.id}>
        <td className="exercise-number">
          {index + 1}
        </td>
        <td>
          {exercise.typeAbbreviation}
        </td>
        <td>
          <ChapterSection chapterSection={chapterSection} />
        </td>
        <td>
          {lo.value}
        </td>
        <td>
          {dok.value}
        </td>
        <td>
          {blooms.value}
        </td>
        <td>
          {S.numberWithOneDecimalPlace(points)}
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
          Tutor
        </td>
        <td>
          NA
        </td>
        <td>
          Personalized question assigned by Tutor based on student performance
        </td>
        <td>
          NA
        </td>
        <td>
          NA
        </td>
        <td>
          1.0
        </td>
      </tr>
    );
  }

  render() {
    const { ux: { selectedExercises, numTutorSelections } } = this.props;

    return (
      <StyledOverview
        data-test-id="questions-overview-table"
      >
        <table>
          <thead>
            <tr>
              <td>
                Question No.
              </td>
              <td>
                Type
              </td>
              <td>
                Section
              </td>
              <td>
                Learning Objective
              </td>
              <td>
                DoK level
              </td>
              <td>
                Bloom‘s Level
              </td>
              <td>
                Points
              </td>
            </tr>
          </thead>
          <tbody>
            {selectedExercises.reduce(this.renderExercise, [])}
            {times(numTutorSelections, index =>
              this.renderTutorRow(selectedExercises, index))}
          </tbody>
        </table>
      </StyledOverview>
    );
  }
}


export default QuestionsOverview;
