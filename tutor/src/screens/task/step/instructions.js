import { React, PropTypes, observer, styled, moment } from 'vendor';
import { colors } from '../../../theme';
import { OuterStepCard, InnerStepCard } from './card';
import StepContinueBtn from './continue-btn';
import S from '../../../helpers/string';

const CardBody = styled(InnerStepCard)`
  padding-bottom: 5rem;
`;

const Header = styled.h2`
  background: ${props => props.templateColors.background};
  border-left: 8px solid ${props => props.templateColors.border};
  background-color: ${props => props.templateColors.background};
  font-size: 1.8rem;
  font-weight: bold;
  padding: 1.5rem 3.2rem;
  display: flex;
  line-height: inherit;
  justify-content: space-between;
  align-items: center;
`;

const StyledPoints = styled.span`
  font-size: 1.6rem;
  font-weight: normal;
`;

const Points = ({ task }) => {
  if (task.isExternal) {
    return null;
  }
  return (
    <StyledPoints>
      {S.numberWithOneDecimalPlace(task.availablePoints)} points
    </StyledPoints>
  );
};
Points.propTypes = {
  task: PropTypes.object.isRequired,
};

const Body = styled.div`
  padding: 4rem 16rem;
  p {
    margin: 0.5rem 0 2rem 0;
  }
  li {
    margin: 0.5rem 0;
  }
`;

const Footer = styled.div`
  border-top: 1px solid ${colors.neutral.thin};
  margin: 0 16rem;
  display: flex;
  justify-content: flex-end;
  .btn {
    margin: 2rem 0;
    padding: 1rem;
  }
`;

const Heading = styled.div`
  font-weight: bold;
`;

const HomeworkWeights = observer(({ task }) => {
  if (!task.isHomework) { return null; }
  return (
    <>
      <Heading>Score for auto-graded questions (MCQs, 2-step uestions)</Heading>
      <ul>
        <li>Weight for correctness: {S.asPercent(task.correctness_weight)}% of the questions point value</li>
        <li>Weight for completion: {S.asPercent(task.completion_weight)}% of the questions point value</li>
      </ul>
    </>
  );
});

const format = (date) => moment(date).format('dd, MMM Do YYYY [at] h:mm a');

const LateWorkPolicy = observer(({ task }) => {
  if (!task.hasLateWorkPolicy) { return null; }

  return (
    <>
      <Heading>Late work policy</Heading>
      <ul>
        <li>After the due date, the late work policy will be in effect.</li>
        <li>
          {task.humanLateWorkPenalty} of point value earned after the due date will be deducted
          for each late {task.late_work_penalty_applied == 'daily' ? 'day' : 'assignment'}
        </li>
      </ul>
    </>
  );
});

const ExternalLink = observer(({ step, children, ...props }) => {
  let { external_url } = step;
  if (!/^https?:\/\//.test(external_url)) {
    external_url = `http://${external_url}`;
  }

  const onContinue = () => {
    step.is_completed = true;
    step.save();
  };

  return (
    <a
      href={external_url}
      target="_blank"
      onContextMenu={(ev) => ev.preventDefault()}
      onClick={onContinue}
      {...props}
    >
      {children}
    </a>
  );
});

const Description = observer(({ task }) => {
  if (!task.description) { return null; }
  return (
    <>
      <Heading>Instructor notes</Heading>
      <p>{task.description}</p>
    </>
  );
});

const ExternalTaskInfo = observer(({ task }) => {
  if (!task.isExternal) { return null; }
  const [step] = task.steps;

  return (
    <>
      <Heading>Assignment URL</Heading>
      <p>
        <ExternalLink step={step}>{step.external_url}</ExternalLink>
      </p>
    </>
  );
});

const ContinueBtn = observer(({ ux }) => {
  if (ux.task.isExternal) {
    return (
      <ExternalLink step={ux.task.steps[0]} className="btn btn-primary">
        Open assignment URL
      </ExternalLink>
    );
  }
  return (
    <StepContinueBtn label="Start" data-test-id="value-prop-continue-btn" variant="primary" ux={ux} />
  );
});

const Instructions = observer((props) => {

  const { ux, ux: { task } } = props;

  return (
    <OuterStepCard>
      <CardBody
        data-test-id={`${task.type}-instructions`}
      >
        <Header className="heading" templateColors={colors.templates[task.type]}>
          <span>Assignment details or instructions</span>
          <Points task={task} />
        </Header>
        <Body>
          <Description task={task} />

          <Heading>Due date</Heading>
          <p>{format(task.dueAtMoment)}</p>

          <Heading>Close date</Heading>
          <p>{format(task.closesAtMoment)}</p>

          <LateWorkPolicy task={task} />
          <HomeworkWeights task={task} />
          <ExternalTaskInfo task={task} />
        </Body>
        <Footer>
          <ContinueBtn ux={ux} />
        </Footer>
      </CardBody>
    </OuterStepCard>
  );
});
Instructions.displayName = 'Instructions';

export default Instructions;
