import { useState } from 'react';
import { some, remove, isEmpty } from 'lodash';
import { Button } from 'react-bootstrap';
import { React, PropTypes, styled } from 'vendor';
import ExerciseCards from '../../components/exercises/cards';
import { colors } from 'theme';
import UX from './ux';

const StyledExerciseCardsWrapper = styled.div`
  // to take into account the footer sticked at the bottom
  margin-bottom: 8rem;
  .exercise-cards {
    .exercise-sections {
      margin-top: 6rem;
      label {
        margin-bottom: 2rem;
      }
    }
    .exercises {
      display: flex;
      flex-wrap: wrap;
      -webkit-box-pack: justify;
      justify-content: space-between;
      padding-bottom: 1.6rem;
      > div {
        flex: 0 1 49%;
        margin-bottom: 3.5rem;
        .openstax-answer {
          border-top: 0.1rem solid ${colors.neutral.pale};
          padding: 0.5rem 0;
        }
        .card-body {
          .selected-mask {
            background-color: #6abcce;
            opacity: 0.14;
          }
          .selected-student-preview-check {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 1;
            :before {
              content: "";
              display: block;
              margin-top: 8%;
              margin-left: 90%;
              background-size: 95%;
              background-repeat: no-repeat;
              height: 50px;
              width: 50px;
            }
          }
          .controls-overlay {
            .message {
              display: flex;
              flex-flow: column;
              .action.delete {
                background-color: #929292;
                height: 60px;
                padding-top: 20px;
                &:before {
                  content: none;
                }
              }
            }
          }
        }
      }
    }
  }
`;

const StyledFooterControls = styled.div`
    display: flex;
    width: 100%;
    height: 8rem;
    padding: 1.5rem 3.5rem;
    background-color: white;
    border-top: 2px solid ${colors.neutral.pale};
    align-items: center;
    position: fixed;
    bottom: 0;
    justify-content: flex-end;

    button {
      padding: 1rem 3rem;
    }

     &&& {
       button + button {
        margin-left: 3.2rem;
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
      handler: () => ux.deletePracticeQuestion(exercise.id),
    };

    return actions;
  };

  const getExerciseIsSelected = (exercise) => {
    return some(selectedExerciseIds, se => se === exercise.id);
  };

  const clearSelection = () => {
    setSelectedExerciseIds([]);
  };

  const startPractice = () => {
    console.log('start practice');
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
    <>
      <StyledExerciseCardsWrapper className="practice-questions-list">
        <ExerciseCards
          {...sharedProps}
          focusedExercise={undefined}
          questionType="student-preview"
          onShowDetailsViewClick={undefined} />
      </StyledExerciseCardsWrapper>
      <StyledFooterControls>
        <Button
          variant="default"
          disabled={isEmpty(selectedExerciseIds)}
          onClick={clearSelection}>
              Clear Selection
        </Button>
        <Button
          variant="primary"
          disabled={isEmpty(selectedExerciseIds)}
          onClick={startPractice}>
            Start Practice
        </Button>
      </StyledFooterControls>
    </>
  );
};
PracticeQuestionsList.propTypes = {
  ux: PropTypes.instanceOf(UX).isRequired,
};

export default PracticeQuestionsList;