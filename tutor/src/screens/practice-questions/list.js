import { useState } from 'react';
import { some, remove, isEmpty, uniq, map, compact } from 'lodash';
import { Button } from 'react-bootstrap';
import { React, PropTypes, styled } from 'vendor';
import ExerciseCards from '../../components/exercises/cards';
import Router from '../../helpers/router';
import { STUDENT_PRACTICE_TYPES } from '../../config'
import { colors, breakpoint } from 'theme';
import UX from './ux';
import DeleteQuestionModal from './delete-modal';

const StyledExerciseCardsWrapper = styled.div`
  // to take into account the footer sticked at the bottom
  margin-bottom: 8rem;
  ${breakpoint.tablet`
    padding: 10px;
    margin-bottom: 5.6rem;
  `}
  .exercise-cards {
    // ipad pro
    @media only screen and (max-width:1024px) {
      margin: 0.5rem;
    }
    .exercise-sections:first-child {
      margin-top: 6rem;
      ${breakpoint.tablet`
        margin-top: 1.5rem;
      `}
    }
    .exercise-sections {
      label {
        margin-bottom: 2rem;
        ${breakpoint.mobile`
          font-size: 16px;
          margin-bottom 1rem;
        `}
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
        ${breakpoint.tablet`
          flex: 0 1 100%;
        `}
        .openstax-answer {
          border-top: 0.1rem solid ${colors.neutral.pale};
          padding: 0.5rem 0;
        }
        .card-body {
          .selected-mask {
            background-color: #6abcce;
            opacity: 0.14;
          }
          // checkmark when a question is selected
          .selected-student-mpp-check {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 1;
            :before {
              content: "";
              display: block;
              margin-top: 2%;
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
              .action {
                &.exclude {
                  background-color: #424242;
                  &:before { 
                    background-color: #424242;
                  }
                }
                &.delete {
                  background-color: ${colors.neutral.lite};
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
    z-index: 1;
    ${breakpoint.mobile`
      height: 5.6rem;
      justify-content: center;
      padding: 0;
    `}
    .btn {
      padding: 1rem 3rem;
      ${breakpoint.mobile`
        padding: 1rem;
        font-size: 1.4rem;
        width: 40%;
      `}
    }
     &&& {
       .btn + .btn {
          margin-left: 3.2rem;
          ${breakpoint.mobile`
            margin-left: 3rem;
          `}
       }
    }
`;

const PracticeQuestionsList = ({ ux, history }) => {
    const [selectedExerciseIds, setSelectedExerciseIds] = useState([]);
    const [exerciseToBeDeleted, setExerciseToBeDeleted] = useState(null);

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
            handler: () => setExerciseToBeDeleted(exercise),
        };
        return actions;
    };

    const getExerciseIsSelected = (exercise) => {
        return some(selectedExerciseIds, se => se === exercise.id);
    };

    const getExerciseDisableMessage = (exercise) => {
        const practiceQuestion = ux.practiceQuestions.findByExerciseId(exercise.id);
    
        if(practiceQuestion && !practiceQuestion.available) {
            return 'This question can be practiced after it has been graded';
        }
        return null;
    };

    const clearSelection = () => {
        setSelectedExerciseIds([]);
    };

    const startPractice = () => {
        const practiceQuestionIds = compact(
            uniq(map(selectedExerciseIds, eid => {
                const pq = ux.practiceQuestions.findByExerciseId(eid);
                return pq ? pq.id : null;
            })));

        return history.push(
            Router.makePathname(
                'practiceTopics',
                { courseId: ux.course.id },
                { 
                    query: { 
                        type: STUDENT_PRACTICE_TYPES.SAVED,
                        practice_question_ids: practiceQuestionIds,
                    },
                }
            ));
    };

    const deletePracticeQuestion = async (exerciseId) => {
        const practiceQuestion = ux.practiceQuestions.findByExerciseId(exerciseId);
        await practiceQuestion.destroy();
        // after the practice question was deleted from the api, delete it from exercises also.
        ux.exercises.deleteByExerciseId(exerciseId);
    };

    const exerciseCardProps = {
        questionType: 'student-mpp',
        exercises: ux.exercises,
        course: ux.course,
        book: ux.course.referenceBook,
        pageIds: ux.exercises.uniqPageIds,
        getExerciseActions,
        getExerciseIsSelected,
        getExerciseDisableMessage,
        topScrollOffset: 100,
    };

    return (
        <>
            <StyledExerciseCardsWrapper className="practice-questions-list">
                <ExerciseCards {...exerciseCardProps}/>
            </StyledExerciseCardsWrapper>
            <StyledFooterControls>
                <Button
                    data-test-id="clear-practice-selection"
                    variant="default"
                    disabled={isEmpty(selectedExerciseIds)}
                    onClick={clearSelection}>
              Clear Selection
                </Button>
                <Button
                    data-test-id="start-practice"
                    variant="primary"
                    disabled={isEmpty(selectedExerciseIds)}
                    onClick={startPractice}>
            Start Practice
                </Button>
            </StyledFooterControls>
            {exerciseToBeDeleted && 
        <DeleteQuestionModal
            onDelete={() => {
                deletePracticeQuestion(exerciseToBeDeleted.id);
                setExerciseToBeDeleted(null);
            }}
            onCancel={() => setExerciseToBeDeleted(null)}/> }
        </>
    );
};
PracticeQuestionsList.propTypes = {
    ux: PropTypes.instanceOf(UX),
    history: PropTypes.object.isRequired,
};

export default PracticeQuestionsList;
