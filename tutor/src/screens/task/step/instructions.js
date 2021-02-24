import { React, PropTypes, observer, styled } from 'vendor';
import TutorLink from '../../../components/link';
import { colors, navbars } from '../../../theme';
import { OuterStepCard, InnerStepCard } from './card';
import StepContinueBtn from './continue-btn';
import S from '../../../helpers/string';
import ScoresHelper from '../../../helpers/scores';
import Time from '../../../components/time';

const CardBody = styled(InnerStepCard)`
  padding-bottom: 5rem;
  /* reading assignment has a sticky navigation bar at the bottom */
  /* all other assignments, make this div to fill up the screen (the header is 20vh) */
  ${({ theme, taskType }) => taskType !== 'reading' && theme.breakpoint.only.mobile`
    height: calc(100vh - ${navbars.top.height} - ${navbars.bottom.height});
    margin: 0;
  `}
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

  ${({ theme }) => theme.breakpoint.tablet`
    .instructions-text {
      display: none;
    }
  `}

${({ theme }) => theme.breakpoint.only.mobile`
    padding: 1.5rem 1rem;
  `}
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
            {ScoresHelper.formatPoints(task.availablePoints)} points
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
    padding-left: 15px;
  }
  li {
    margin: 0.5rem 0;
  }

  ${({ theme }) => theme.breakpoint.only.mobile`
    padding: 2rem 1.5rem 1rem;
  `}

  ${({ theme }) => theme.breakpoint.only.tablet`
    padding: 2rem 3rem 10rem;
  `}
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

  /* reading assignment has a sticky navigation bar at the bottom */
  /* all other assignments, make the footer stick to the bottom */
  ${({ theme, taskType }) => taskType !== 'reading' && theme.breakpoint.only.mobile`
      position: absolute;
      bottom: 0;
  `}

  ${({ theme }) => theme.breakpoint.only.mobile`
    margin: 0;
    justify-content: center;
    width: 100%;
    .btn {
      padding: 2rem 6rem;
    }
  `}

  ${({ theme }) => theme.breakpoint.only.tablet`
    margin: 0 3rem;
    justify-content: center;
    .btn {
      padding: 1rem 6rem;
    }
  `}
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

const format = (date) => <Time date={date} format="concise" />;

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

    let buttonLabel = 'Start';
    if (ux.task.completed || ux.task.isAssignmentClosed) {
        buttonLabel = 'Review';
    }
    else if (ux.task.started) {
        buttonLabel = 'Continue';
    }

    return (
        <StepContinueBtn
            label={buttonLabel}
            data-test-id="value-prop-continue-btn"
            variant="primary" ux={ux}
        />
    );
});

const Dates = observer(({ task }) => {
    if (task.isPractice) return null;
    return (
    <>
      <Heading>Due date</Heading>
      <p>{format(task.due_at)}</p>

      {!task.isEvent && (
        <>
          <Heading>Close date</Heading>
          <p>{format(task.closes_at)}</p>
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
                taskType={task.type}
            >
                <Header className="heading" templateColors={colors.templates[task.type]}>
                    {/* On tablet and mobile screen, do not display the `and instructions` text */}
                    <span>Assignment details <span className="instructions-text">and instructions</span></span>
                    <Points task={task} />
                </Header>
                <Body>
                    <Description task={task} />

                    <Dates ux={ux} task={task} />
                    <PracticeInstructions task={task} />
                    <LateWorkPolicy task={task} />
                    <ReadingWeights task={task} />
                    <ExternalTaskInfo task={task} />
                </Body>
                <Footer taskType={task.type}>
                    <ContinueBtn ux={ux} />
                </Footer>
            </CardBody>
        </OuterStepCard>
    );
});
Instructions.displayName = 'Instructions';

export default Instructions;
