import { React, PropTypes, cn, observer, styled } from 'vendor';
import { colors, breakpoint } from 'theme';
import { SpyInfo } from './spy-info';
import { Icon } from 'shared';
import { StepLockIcon } from '../../../components/icons/lock'
import { StudentTaskStep } from '../../../models';
import ScoresHelper from '../../../helpers/scores';
import { StepCard as OSStepCard } from '@openstax/assignment-components';

export
const InnerStepCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 400px;
  border-radius: 0.25rem;
  margin: 0 auto 5rem auto;
  border: 1px solid ${colors.neutral.light};
  border-radius: 0.25rem;
  background-color: white;

  ${breakpoint.desktop`
    max-width: 1000px;
    min-width: 750px;
  `}
  ${breakpoint.large`
    min-width: 1000px;
  `}
`;

export
const OuterStepCard = styled.div`
  padding: 2rem;

  ${({ theme }) => theme.breakpoint.tablet`
    padding: 0;
  `}
`;

const LoadingCard = styled(InnerStepCard)`
  min-width: 960px;
  padding: 2rem;
`;

const StepCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: ${colors.templates.homework.background};
  font-size: 1.8rem;
  line-height: 3rem;

  div {
    display: flex;
    align-items: center;
  }

  div.question-info {
    font-weight: bold;

    .ox-icon-lock {
        margin-right: 1rem;
    }
  }

  .num-questions, .points, .separator {
      display: none;
  }

  .exercise-id, .separator {
      font-weight: normal;
  }

  .separator {
      margin: 0 1rem;
  }

  .exercise-id {
      height: 28px; // Fix baseline issue
  }

  button {
    color: ${colors.neutral.gray};
  }

  .openstax-exercise-badges {
      margin: 0;
      line-height: 2rem;
      svg {
          display: block;
          &:not(.interactive) {
              margin: 0 0 0 6px !important;
          }
      }
  }

  ${breakpoint.desktop`
      button.ox-icon-angle-left, button.ox-icon-angle-right {
          display: none;
      }
      .separator {
          display: inherit;
      }
  `}

    /*
    1. Show the arrows to move to previous and next question.
    2. Show the number of questions.
    3. Override box-shadow of icons when turned into a button.
    */
    ${({ theme }) => theme.breakpoint.tablet`
        font-size: 1.6rem;
        line-height: 2.5rem;

        svg.ox-icon {
            display: inherit;
            margin: 0;
        }
        button.ox-icon-angle-left {
            margin-right: ${breakpoint.margins.tablet};
        }
        button.ox-icon-angle-right {
            margin-left: ${breakpoint.margins.tablet};
        }
        .openstax-exercise-badges svg {
            display: none;
        }
        .num-questions, points {
            display: inherit;
        }

        .exercise-id {
            display: none;
        }

        button[class^='ox-icon-angle']:hover {
            box-shadow: none;
        }
  `}

  ${({ theme }) => theme.breakpoint.mobile`
      font-size: 1.4rem;
      line-height: 2rem;
      padding: 10px 8px;

      button.ox-icon-angle-left {
          margin-right: ${breakpoint.margins.mobile};
      }
      button.ox-icon-angle-left {
          margin-right: ${breakpoint.margins.mobile};
      }
  `}
`;

export const StepCardFooter = styled.div`
    padding: var(--step-card-padding-top) var(--step-card-padding-side);
    border-top: 1px solid ${colors.neutral.pale};
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    font-size: 1.4rem;
    line-height: 2rem;

    > * {
        flex-grow: 1;
    }

    button {
        width: 160px;
        height: 48px;
    }

    .points {
        margin-bottom: 1.6rem; // Replace with https://caniuse.com/?search=gap soon

        .attempts-left {
            color: #F36B32;
        }
    }

    .controls {
        display: flex;
        flex-flow: column wrap-reverse;
        margin-left: 1.6rem; // Replace with https://caniuse.com/?search=gap soon

        button + button {
            margin: 0.8rem 0 0 0;
        }
    }

    ${breakpoint.desktop`
        padding: 32px var(--step-card-padding-side);
        flex-wrap: nowrap;

        .points {
            max-width: 400px;
        }

        .controls {
            flex-flow: row;
            justify-content: flex-end;

            button + button {
                margin: 0 0 0 0.8rem;
            }
        }
    `}
`;

const StepCardQuestion = styled.div`
    --step-card-padding-top: 48px;
    --step-card-padding-side: 140px;

    ${({ theme }) => theme.breakpoint.only.tablet`
        --step-card-padding-top: ${breakpoint.margins.tablet};
        --step-card-padding-side: ${breakpoint.margins.tablet};
    `}

    ${({ theme }) => theme.breakpoint.only.mobile`
        --step-card-padding-top: calc(${breakpoint.margins.mobile} * 2);
        --step-card-padding-side: ${breakpoint.margins.mobile};
    `}

    ${props => props.unpadded ? '.step-card-body' : '&'} {
        padding: var(--step-card-padding-top) var(--step-card-padding-side);
    }

    & + div .step-card-body {
        padding-top: 0;
    }

    &.exercise-context, &.exercise-stimulus, &.exercise-stem {
        padding-bottom: 0;
    }

    ${({ theme }) => theme.breakpoint.only.mobile`
        && .question-feedback {
            margin-left: 0;

           .arrow { margin-left: 12px; }
        }
    `}

    .reading-step & {
        padding: 0;
    }

    ${breakpoint.desktop`
        .video-step &, .interactive-step & {
            .openstax-exercise-badges {
                margin-right: 3.8rem;
            }
        }
    `}

    ${breakpoint.mobile`
        .openstax-exercise-badges svg {
            margin-right: ${breakpoint.margins.mobile};
        }
    `}

    &&& {
        .openstax-has-html .splash .frame-wrapper { margin-top: 0; }
    }
`;
LoadingCard.displayName = 'LoadingCard';


const StepCard = ({
    questionNumber,
    numberOfQuestions,
    stepType,
    isHomework,
    wasGraded,
    isClosed,
    availablePoints,
    unpadded,
    className,
    children,
    goBackward,
    canGoBackward,
    goForward,
    canGoForward,
    exerciseId,
    multipartBadge,
    typeBadge,
    ...otherProps }) =>
    (
        <OuterStepCard {...otherProps}>
            {multipartBadge}
            <InnerStepCard className={className}>
                {questionNumber && isHomework && stepType === 'exercise' &&
                <StepCardHeader>
                    <div>
                        {
                            canGoBackward && goBackward &&
                                <Icon
                                    size="lg"
                                    type="angle-left"
                                    onClick={goBackward}
                                />
                        }
                        <div className="question-info">
                            <StepLockIcon wasGraded={wasGraded} isClosed={isClosed}/>
                            <span>Question {questionNumber}</span>
                            <span className="num-questions">&nbsp;/ {numberOfQuestions}</span>
                            <span className="separator">|</span>
                            <span className="exercise-id">ID: {exerciseId}</span>
                        </div>
                    </div>
                    <div>
                        <div className="points">{ScoresHelper.formatPoints(availablePoints)} Points</div>
                        {typeBadge}
                        {
                            canGoForward && goForward &&
                                <Icon
                                    size="lg"
                                    type="angle-right"
                                    onClick={goForward}
                                />
                        }
                    </div>
                </StepCardHeader>
                }
                <StepCardQuestion unpadded={unpadded}>{children}</StepCardQuestion>
            </InnerStepCard>
        </OuterStepCard>
    );
StepCard.propTypes = {
    unpadded: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    questionNumber: PropTypes.number,
    numberOfQuestions: PropTypes.number,
    goBackward: PropTypes.func,
    canGoBackward: PropTypes.bool,
    goForward: PropTypes.func,
    canGoForward: PropTypes.bool,
    stepType: PropTypes.string,
    isHomework: PropTypes.string,
    wasGraded: PropTypes.bool,
    isClosed: PropTypes.bool,
    availablePoints: PropTypes.number,
    exerciseId: PropTypes.string,
    multipartBadge: PropTypes.node,
    typeBadge: PropTypes.node,
};


const TaskStepCard = observer(({
    step,
    questionNumber,
    numberOfQuestions,
    children,
    className,
    goBackward,
    canGoBackward,
    goForward,
    canGoForward,
    typeBadge,
    ...otherProps }) => (
        <OSStepCard
            {...otherProps}
            questionNumber={questionNumber}
            numberOfQuestions={numberOfQuestions}
            stepType={step.type}
            isHomework={step.task.type}
            data-task-step-id={step.id}
            availablePoints={step.available_points}
            className={cn(`${step.type}-step`, className)}
            exerciseId={step.uid}
            leftHeaderChildren={canGoBackward && goBackward && <Icon size="lg" type="angle-left" onClick={goBackward} />}
            rightHeaderChildren={
                <>
                    {typeBadge}
                    {canGoForward && goForward && <Icon size="lg" type="angle-right" onClick={goForward} />}
                </>
            }
            headerTitleChildren={<StepLockIcon wasGraded={step.was_manually_graded} isClosed={step.task.isAssignmentClosed}/>}
        >
            {children}
            <SpyInfo model={step} />
        </OSStepCard>
    ));
TaskStepCard.displayName = 'TaskStepCard';
TaskStepCard.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    step: PropTypes.instanceOf(StudentTaskStep).isRequired,
    questionNumber: PropTypes.number,
};


export { StepCard, TaskStepCard, LoadingCard };
