import { React, PropTypes, styled, observer, css, cn } from 'vendor';
import { colors } from 'theme';
import TutorLink from '../../components/link';
import SmallText from '../../components/small-text';
import { Header } from './details';
import PublishScores from '../../components/buttons/publish-scores';

const StyledTutorLink = styled(TutorLink)`
  margin-bottom: 2.5rem;
  &.btn.btn-standard {
    min-width: 16.7rem;
  }
`;

const GradeAnswersButton = observer(({ ux, regrade = false }) => {
    return (
        <StyledTutorLink
            data-test-id="grade-answers-btn"
            className={cn('btn btn-standard btn-new-flag btn-inline', { 'btn-primary': !regrade })}
            to="gradeAssignment"
            params={{
                id: ux.planId,
                periodId: ux.selectedPeriod.id,
                courseId: ux.course.id,
            }}
        >
            {!regrade && <span className="flag">{ux.gradeableQuestionCount} NEW</span>}
            <span>{`${regrade ? 'Regrade' : 'Grade'} answers`}</span>
        </StyledTutorLink>
    );
});

const ViewScores = observer(({ ux }) => {
    if (ux.course.uses_pre_wrm_scores) { return null; }
    return (
        <div>
            <p>View scores for auto-graded questions</p>
            <button
                className="btn btn-standard btn-inline"
                onClick={() => ux.onTabSelection(2)}
            >
        View scores
            </button>
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

const DarkBlue = css`
  border-color: #36D0E9;
  background: #DAF3F8;
`;

const LightBlue = css`
  border-color: #8AEBF6;
  background: #EFFDFF;
`;

const DarkYellow = css`
  border-color: #F4D018;
  background: #F4D018;
`;

const LightYellow = css`
  border-color: #FDEA85;
  background: #FAF8ED;
`;

const Gray = css`
  border-color: ${colors.neutral.pale};
  background: #eeeded;
`;

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
  min-width ${props => css`
    calc(1rem + 1rem * ${props.value.toString().length});
  `};
  height: 4.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => props.variant === 'Completed' && (props.isReading ? DarkYellow : DarkBlue)}
  ${props => props.variant === 'In progress' && (props.isReading ? LightYellow : LightBlue)}
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
  ${props => props.variant === 'Completed' && (props.isReading ? DarkYellow : DarkBlue)}
  ${props => props.variant === 'In progress' && (props.isReading ? LightYellow : LightBlue)}
  ${props => props.variant === 'Not started' && Gray}
`;

const Definition = styled.dd`
  margin: 0;
  color: ${colors.neutral.thin};
  font-size: 1rem;
`;

const Body = styled.div`
  p { margin-top: 1rem; }
`;

const StackedBarChart = observer(({ stats, isReading = false }) => {
    return (
        <ChartWrapper>
            <Chart>
                {stats.filter(s => s.value > 0).map((stat, i) =>
                    <ChartItem
                        width={stat.percent * 100}
                        value={stat.value}
                        variant={stat.label}
                        aria-label={`${stat.label}: ${stat.value}`}
                        key={`chart-item-${i}`}
                        isReading={isReading}
                    >
                        {stat.value}
                    </ChartItem>
                )}
            </Chart>
            <DefinitionsWrapper>
                {stats.map((stat, i) =>
                    <React.Fragment key={`term-${i}`}>
                        <Term variant={stat.label} aria-label={stat.label} isReading={isReading} />
                        <Definition>{stat.label}</Definition>
                    </React.Fragment>
                )}
            </DefinitionsWrapper>
        </ChartWrapper>
    );
});

const ViewSubmissions = observer(({ ux }) => {
    return (
        <>
            <p>View student submissions for this assignment</p>
            <button
                className="btn btn-standard btn-inline"
                onClick={() => ux.onTabSelection(1)}
            >
        View submissions
            </button>
        </>
    );
});

const UnpublishedScores = observer(({ ux }) => {
    return (
        <>
            <p>This assignment has unpublished scores</p>
            <PublishScores ux={ux} />
        </>
    );
});

const GradeableAnswers = observer(({ ux }) => {
    return (
        <>
            <p>This assignment is now open for grading</p>
            <GradeAnswersButton ux={ux} />
        </>
    );
});

const RegradableAnswers = observer(({ ux }) => {
    return (
        <>
            <p>This assignment can be regraded.</p>
            <GradeAnswersButton ux={ux} regrade={true} />
        </>
    );
});

const BlockWrapper = observer(({ header, children }) => {
    return (
        <>
            <Header>
                <h6>{header}</h6>
            </Header>
            <Body>
                {children}
            </Body>
        </>
    );
});

const BeforeDueWRQ = () => {
    return (
        <BlockWrapper header="Grading">
            <Centered>
                <p>This assignment is not open for grading yet.</p>
                <SmallText font-size="1.4rem">(You can start grading after the due date)</SmallText>
            </Centered>
        </BlockWrapper>
    );
};

const AfterDueWRQ = observer(({ ux }) => {
    return (
        <BlockWrapper header={ux.hasGradeableAnswers ? 'Grading' : 'Scores'}>
            {ux.scores.hasUngradedQuestions
                ? <GradeableAnswers ux={ux} />
                : ux.scores.hasUnPublishedScores
                    ? <UnpublishedScores ux={ux} />
                    : ux.scores.hasFinishedGrading
                        ? <RegradableAnswers ux={ux} />
                        : <ViewSubmissions ux={ux} />}
            <ViewScores ux={ux} />
        </BlockWrapper>
    );
});

const BeforeDueMCQ = observer(({ ux, ux: { progressStatsForPeriod } }) => {
    return (
        <BlockWrapper header="Progress">
            <Centered>
                <p>This assignment is still in progress</p>
                <StackedBarChart stats={progressStatsForPeriod} isReading={ux.planScores.isReading} />
            </Centered>
        </BlockWrapper>
    );
});

const AfterDueMCQ = observer(({ ux }) => {
    return (
        <BlockWrapper header="Scores">
            {ux.hasUnPublishedScores ? <PublishScores ux={ux} /> : <ViewSubmissions ux={ux} />}
            <ViewScores ux={ux} />
        </BlockWrapper>
    );
});

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
