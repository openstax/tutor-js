import { React, PropTypes, observer, styled, moment } from 'vendor';
import TutorLink from '../../../components/link';
import { colors } from '../../../theme';
import { OuterStepCard, InnerStepCard } from './card';
import StepContinueBtn from './continue-btn';
import S from '../../../helpers/string';

const CardBody = styled(InnerStepCard)`
  padding-bottom: 5rem;
`;

const Header = styled.h2`
  border-left: 8px solid ${props => props.templateColors.border};
  background-color: ${({ templateColors }) => templateColors && templateColors.background};
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
  if (task.isExternal || task.isEvent) {
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
    margin: 0.5rem 0 3.2rem 0;
    line-height: 2rem;
  }
  ul {
    margin-bottom: 3.2rem;
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

const ReadingWeights = observer(({ task }) => {
  if (!task.isReading) { return null; }
  return (
    <>
      <Heading>Score for reading questions</Heading>
      <ul>
        <li>Weight for correctness: {S.asPercent(task.correctness_weight)}% of the question's point value</li>
        <li>Weight for completion: {S.asPercent(task.completion_weight)}% of the question's point value</li>
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

  if (ux.task.isEvent) {
    return (
      <TutorLink className="btn btn-primary" to="dashboard" params={{ courseId: ux.course.id }}>Close</TutorLink>
    );
  }

  let nextIncompleteStepId;
  let buttonLabel = 'Start';
  if (ux.task.steps.every(s => s.is_completed)) {
    buttonLabel = 'Review';
  }
  else if (ux.task.steps.some(s => s.is_completed)) {
    buttonLabel = 'Continue';
    nextIncompleteStepId = ux.task.steps.find(s => !s.is_completed).id;
  }

  return (
    <StepContinueBtn
      label={buttonLabel}
      data-test-id="value-prop-continue-btn"
      variant="primary" ux={ux}
      nextIncompleteStepId={nextIncompleteStepId}
    />
  );
});

const Dates = observer(({ task }) => {
  if (task.isPractice) return null;
  return (
    <>
      <Heading>Due date</Heading>
      <p>{format(task.dueAtMoment)}</p>

      {!task.isEvent && (
        <>
          <Heading>Close date</Heading>
          <p>{format(task.closesAtMoment)}</p>
        </>
      )}
    </>
  );
});

const PracticeInstructions = observer(({ task }) => {
  if (!task.isPractice) return null;

  return (
    <>
      <p>
        This is a practice assignment. It will not be graded, and it won’t
        count toward your course average in OpenStax Tutor.
      </p>
      <p>
        Practicing these topics will give you a better idea of which areas of the
        text you might want to go back and study.
      </p>
      <p>You will see immediate feedback
        on your answers, and each question card has a link to the section of the book
        where you’ll find more information on the topic. Good luck!
      </p>
    </>
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
          <span>Assignment details and instructions</span>
          <Points task={task} />
        </Header>
        <Body>
          <Description task={task} />

          <Dates task={task} />
          <PracticeInstructions task={task} />
          <LateWorkPolicy task={task} />
          <ReadingWeights task={task} />
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
