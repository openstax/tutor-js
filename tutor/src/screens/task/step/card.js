import { React, PropTypes, cn, observer, styled } from '../../../helpers/react';
import Theme from '../../../theme';
import { SpyInfo } from './spy-info';
import Step from '../../../models/student-tasks/step';

const InnerStepCard = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 400px;
  width: 960px;
  border-radius: 0.25rem;
  margin: 0 auto 5rem auto;
  border: 1px solid ${Theme.colors.neutral.light};
  border-radius: 0.25rem;
  background-color: white;
  ${props => !props.unpadded && 'padding: 50px 140px;'}
`;

const OuterStepCard = styled.div`
  padding: 2rem;
`;

const LoadingCard = styled(InnerStepCard)`
  min-width: 960px;
  padding: 2rem;
`;
LoadingCard.displayName = 'LoadingCard';

const StepCard = ({ unpadded, className, children, ...otherProps }) => (
  <OuterStepCard {...otherProps}>
    <InnerStepCard
      unpadded={unpadded}
      className={className}
    >
      {children}
    </InnerStepCard>
  </OuterStepCard>
);
StepCard.propTypes = {
  unpadded: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};


const TaskStepCard = observer(({ step, children, className, ...otherProps }) => (
  <StepCard
    {...otherProps}
    data-task-step-id={step.id}
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
};


export { StepCard, TaskStepCard, LoadingCard };
