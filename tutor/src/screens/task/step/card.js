import { React, PropTypes, cn, observer, styled } from 'vendor';
import { colors, breakpoint } from 'theme';
import { SpyInfo } from './spy-info';
import { Icon } from 'shared';
import { StudentTaskStep } from '../../../models';
import ScoresHelper from '../../../helpers/scores';

export
const InnerStepCard = styled.div`
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
  padding: 14px 26px;
  background: ${colors.templates.homework.background};

  div {
    display: flex;
    align-items: center;
    svg:last-child, div:last-child {
      margin-left: 15px;
    }
  }

  div:first-child {
    div {
      font-weight: bold;
      span {
        display: none;
      }
    }
  }

  svg {
    margin-top: 3px;
    color: ${colors.neutral.gray};
    display: none;
  }

  /*
  1. Show the arrows to move to previous and next question.
  2. Show the number of questions.
  3. Override box-shadow of icons when turned into a button.
  */
  ${({ theme }) => theme.breakpoint.tablet`
  font-size: 1.6rem;
    padding: 14px 26px 14px 8px;
    svg {
      display: inherit;
    }
    div:first-child {
    > div span {
        display: inherit;
      }
    }
    button[class^='ox-icon-angle']:hover {
      box-shadow: none;
    }
  }
  `}
`;

const StepCardQuestion = styled.div`
  ${props => !props.unpadded && 'padding: 50px 140px;'}

  ${({ theme }) => theme.breakpoint.only.tablet`
    padding: 25px 30px 140px;
  `}

  ${({ theme }) => theme.breakpoint.only.mobile`
    padding: 10px 25px 20px;
    .exercise-step & {
      padding: ${breakpoint.margins.mobile};
    }
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
    availablePoints,
    unpadded,
    className,
    children,
    goBackward,
    canGoBackward,
    goForward,
    canGoForward,
    ...otherProps }) =>
    (
        <OuterStepCard {...otherProps}>
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
                <div>Question {questionNumber} <span>&nbsp;/ {numberOfQuestions}</span></div>
            </div>
            <div>
                <div>{ScoresHelper.formatPoints(availablePoints)} Points</div>
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
    availablePoints: PropTypes.number,
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
    ...otherProps }) =>
    (
        <StepCard
            {...otherProps}
            questionNumber={questionNumber}
            numberOfQuestions={numberOfQuestions}
            goBackward={goBackward}
            canGoBackward={canGoBackward}
            goForward={goForward}
            canGoForward={canGoForward}
            stepType={step.type}
            isHomework={step.task.type}
            data-task-step-id={step.id}
            availablePoints={step.available_points}
            className={cn(`${step.type}-step`, className)}
        >
            {children}
            <SpyInfo model={step} />
        </StepCard>
    ));
TaskStepCard.displayName = 'TaskStepCard';
TaskStepCard.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    step: PropTypes.instanceOf(StudentTaskStep).isRequired,
    questionNumber: PropTypes.number,
};


export { StepCard, TaskStepCard, LoadingCard };
