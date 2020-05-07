import { React, PropTypes, styled, observer, css } from 'vendor';
import { Button } from 'react-bootstrap';
import { colors } from 'theme';
import TutorLink from '../../components/link';

const StyledTutorLink = styled(TutorLink)`
  margin-bottom: 2.5rem;
  &.btn.btn-standard {
    min-width: 16.7rem;
  }
`;

const GradeAnswersButton = observer(({ ux }) => {
  return (
    <StyledTutorLink
      className="btn btn-standard btn-primary btn-new-flag btn-inline"
      to="gradeAssignment"
      params={{ id: ux.planId, periodId: ux.selectedPeriodId, courseId: ux.course.id }}
    >
      <span className="flag">72 New</span>
      <span>Grade answers</span>
    </StyledTutorLink>
  );
});

const ViewScores = observer(() => {
  return (
    <div>
      <p>View scores for auto-graded questions</p>
      <StyledTutorLink
        className="btn btn-standard btn-inline"
        to=""
      >
        View scores
      </StyledTutorLink>
    </div>
  );
});

const Centered = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid ${colors.neutral.pale};
  border-width: 1px 0;
  padding: 2rem 0;

  p:last-child {
    margin-bottom: 0;
  }
`;

const SmallText = styled.p`
  font-size: 1.4rem;
  color: ${colors.neutral.thin};
`;

const DarkBlue = css`
  border-color: #36D0E9;
  background: #DAF3F8;
`;

const LightBlue = css`
  border-color: #8AEBF6;
  background: #EFFDFF;
`;

const Gray = css`
  border-color: ${colors.neutral.pale};
  background: #eeeded;
`

const ChartWrapper = styled.div`
  margin: 0 1rem;
`;

const Chart = styled.div`
  display: flex;
`;

const ChartItem = styled.div`
  border-width: 1px 0;
  border-style: solid;
  &:first-child { border-width: 1px 0 1px 1px; }
  &:last-child { border-width: 1px 1px 1px 0; }
  &:only-child { border-width: 1px; }
  width: ${props => props.width}%;
  height: 4.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => props.variant === 'Completed' && DarkBlue}
  ${props => props.variant === 'In progress' && LightBlue}
  ${props => props.variant === 'Not started' && Gray}
`;

const DefinitionsWrapper = styled.dl`
  margin: 0.6rem 0 0;
  display: flex;
  align-items: center;
  dd + dt {
    margin-left: 1rem;
  }
`;

const Term = styled.dt`
  border-width: 1px;
  border-style: solid;
  display: flex;
  justify-content: center;
  width: 2.3rem;
  height: 0.8rem;
  margin-right: 0.7rem;
  font-size: 1.6rem;
  line-height: 1.8rem;
  ${props => props.variant === 'Completed' && DarkBlue}
  ${props => props.variant === 'In progress' && LightBlue}
  ${props => props.variant === 'Not started' && Gray}
`;

const Definition = styled.dd`
  margin: 0;
  color: ${colors.neutral.thin};
  font-size: 1rem;
`;

const StackedBarChart = observer(({ stats }) => {
  return (
    <ChartWrapper>
      <Chart>
        {stats.filter(s => s.value > 0).map((stat, i) =>
          <ChartItem
            width={stat.percent * 100}
            variant={stat.label}
            aria-label={`${stat.label}: ${stat.value}`}
            key={`chart-item-${i}`}
          >
            {stat.value}
          </ChartItem>
        )}
      </Chart>
      <DefinitionsWrapper>
        {stats.map((stat, i) =>
          <React.Fragment key={`term-${i}`}>
            <Term variant={stat.label} aria-label={stat.label} />
            <Definition>{stat.label}</Definition>
          </React.Fragment>
        )}
      </DefinitionsWrapper>
    </ChartWrapper>
  );
});

const BeforeDueWRQ = () => {
  return (
    <Centered>
      <p>This assignment is not open for grading yet.</p>
      <SmallText>(You can start grading after the due date)</SmallText>
    </Centered>
  )
}

const AfterDueWRQ = observer(({ ux }) => {
  return (
    <>
      <p>This assignment is now open for grading.</p>
      <GradeAnswersButton ux={ux} />
      <ViewScores />
    </>
  )
});

const BeforeDueMCQ = observer(({ ux: { progressStatsForPeriod } }) => {
  return (
    <Centered>
      <p>This assignment is still in progress</p>
      <StackedBarChart stats={progressStatsForPeriod} />
    </Centered>
  )
});

const AfterDueMCQ = () => {
  return (
    <>
      <p>View student submissions for this assignment</p>
      <StyledTutorLink
        className="btn btn-standard btn-inline"
        to=""
      >
        View submissions
      </StyledTutorLink>
      <ViewScores />
    </>
  )
}

const GradingBlock = observer(({ ux }) => {
  const { isEveryExerciseMultiChoice, isPastDue } = ux.planScores.taskPlan;
  const Blocks = isEveryExerciseMultiChoice ?
    [BeforeDueMCQ, AfterDueMCQ] : [BeforeDueWRQ, AfterDueWRQ];
  const Block = Blocks[+ isPastDue];

  return <Block ux={ux} />;
});

GradingBlock.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default GradingBlock;
