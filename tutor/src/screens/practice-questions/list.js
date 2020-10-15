import { useEffect, useState } from 'react';
import { some, remove } from 'lodash';
import { React, PropTypes, styled } from 'vendor';
import ExerciseCards from '../../components/exercises/cards';
import UX from './ux';

const StyledExerciseCardsWrapper = styled.div`
  .exercise-cards {
    & .exercise-sections {
      margin-top: 6rem;
      label {
        margin-bottom: 2rem;
      }
    }
    & .exercises {
      display: flex;
      flex-wrap: wrap;
      -webkit-box-pack: justify;
      justify-content: space-between;
      padding-bottom: 1.6rem;

      > div {
        flex: 0 1 49%;
        margin-bottom: 3.5rem;

        .openstax-answer {
          border-top: 1px solid #d5d5d5;
          padding: 5px 0;
        }
      }
    }
  }
`;

const PracticeQuestionsList = ({ ux }) => {
  const [selectedExerciseIds, setSelectedExerciseIds] = useState([]);

  const getExerciseActions = (exercise) => {
    let actions = {};

    // if exercise is included, show the exclude button
    if (getExerciseIsSelected(exercise)) {
      actions.exclude = {
        message: 'Exclude question',
        handler: () => {
          // need to make new copy to remove
          const copyExerciseIds = selectedExerciseIds.slice();
          remove(copyExerciseIds, se => se === exercise.id);
          setSelectedExerciseIds(copyExerciseIds);
        },
      };
    }
    else {
      actions.include = {
        message: 'Include question',
        handler: () => {
          setSelectedExerciseIds([...selectedExerciseIds, exercise.id]);
        },
      };
    }
    actions.delete = {
      message: 'Delete',
      handler: () => console.log('delete'),
    };

    return actions;
  };

  const getExerciseIsSelected = (exercise) => {
    return some(selectedExerciseIds, se => se === exercise.id);
  };

  const sharedProps = {
    exercises: ux.exercises,
    course: ux.course,
    book: ux.course.referenceBook,
    pageIds: ux.exercises.uniqPageIds,
    getExerciseActions,
    getExerciseIsSelected,
    topScrollOffset: 100,
  };

  return (
    <StyledExerciseCardsWrapper>
      <ExerciseCards
        {...sharedProps}
        focusedExercise={undefined}
        questionType="student-preview"
        onShowDetailsViewClick={undefined} />
    </StyledExerciseCardsWrapper>
  );
};
PracticeQuestionsList.propTypes = {
  ux: PropTypes.instanceOf(UX).isRequired,
};

export default PracticeQuestionsList;