import { React, PropTypes, cn, observer, styled } from 'vendor';
import { colors } from 'theme';
import { SpyInfo } from './spy-info';
import Step from '../../../models/student-tasks/step';
import S from '../../../helpers/string';

const InnerStepCard = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 400px;
  width: 960px;
  border-radius: 0.25rem;
  margin: 0 auto 5rem auto;
  border: 1px solid ${colors.neutral.light};
  border-radius: 0.25rem;
  background-color: white;
`;

const OuterStepCard = styled.div`
  padding: 2rem;
`;

const LoadingCard = styled(InnerStepCard)`
  min-width: 960px;
  padding: 2rem;
`;

const StepCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 14px 26px;
  background: ${colors.templates.homework.background};
  
  div:first-child {
    font-weight: bold;
  }
`;

const StepCardQuestion = styled.div`
  ${props => !props.unpadded && 'padding: 50px 140px;'}
`;


LoadingCard.displayName = 'LoadingCard';

const StepCard = ({ questionNumber, stepType, isHomework, availablePoints, unpadded, className, children, ...otherProps }) => (
  <OuterStepCard {...otherProps}>
    <InnerStepCard className={className}>
      {questionNumber && isHomework && stepType === 'exercise' &&
      <StepCardHeader>
        <div>Question {questionNumber}</div>
        <div>{S.numberWithOneDecimalPlace(availablePoints)} Points</div>
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
  stepType: PropTypes.string,
  isHomework: PropTypes.string,
  availablePoints: PropTypes.number,
};


const TaskStepCard = observer(({ step, questionNumber, children, className, ...otherProps }) => (
  <StepCard
    {...otherProps}
    questionNumber={questionNumber}
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
  step: PropTypes.instanceOf(Step).isRequired,
  questionNumber: PropTypes.number,
};


export { StepCard, TaskStepCard, LoadingCard };
