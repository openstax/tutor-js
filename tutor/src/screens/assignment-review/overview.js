import { React, PropTypes, styled, Theme, css, observer, cn, Box } from 'vendor';
import { StickyTable, Row, Cell } from 'react-sticky-table';
import { isEmpty, compact } from 'lodash';
import { Button } from 'react-bootstrap';
import TutorLink from '../../components/link';
import ScoresHelper from '../../helpers/scores';
import { Icon, ArbitraryHtmlAndMath } from 'shared';
import { DroppedQuestionHeadingIndicator } from '../../components/dropped-question';
import HomeworkQuestions, { ExerciseNumber } from '../../components/homework-questions';
import InfoIcon from '../../components/icons/info';
import DropQuestionIcon from './drop-question-icon';
import { colors } from 'theme';
import Loading from 'shared/components/loading-animation';
import SectionLink from './section-link';
import { DropQuestionModal } from './drop-question-modal';
import TourRegion from '../../components/tours/region';

// https://projects.invisionapp.com/d/main#/console/18937568/403651098/preview

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

const Wrapper = styled.div`
  margin-top: 4rem;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.6rem;
`;

const StyledIcon = styled(Icon)`
  font-size: 2.7rem;
  flex-shrink: 0;
  &&:hover {
    box-shadow: none;
  }
`;

const QuestionId = styled.span`
  border-left: 1px solid ${Theme.colors.neutral.pale};
  padding-left: 0.8rem;
  margin-left: 0.8rem;
  font-weight: normal;
`

const QuestionWithId = ({ question, label, isReading, isCore }) => {
    label = isReading ? 'Question' : isCore ? label : 'OpenStax Tutor Selection'
    return <span>{label}<QuestionId>ID: #{question.exercise.uid}</QuestionId></span>
}

QuestionWithId.propTypes = {
    isCore: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    isReading: PropTypes.bool.isRequired,
    question: PropTypes.object.isRequired,
}
const QuestionHeader = observer(({ ux, styleVariant, label, info }) => (
    <>
        <ExerciseNumber variant={styleVariant} data-question-id={info.question.id}>
            {info.hasFreeResponse && (
                <StyledIcon
                    type={ux.isShowingFreeResponseForQuestion(info.question) ? 'caret-down' : 'caret-right'}
                    onClick={() => ux.toggleFreeResponseForQuestion(info.question)}
                />)}
            <QuestionWithId
                label={label}
                isCore={info.isCore}
                question={info.question}
                isReading={ux.planScores.isReading}
            />
        </ExerciseNumber>
        <Box gap="large" align="center">
            <TourRegion id="drop-any-new">
                <span>{ScoresHelper.formatPoints(info.availablePoints)} Points</span>
                <DropQuestionIcon ux={ux} info={info} />
            </TourRegion>
        </Box>
    </>
));
QuestionHeader.propTypes = {
    styleVariant: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    info: PropTypes.object.isRequired,
};

const QuestionFooter = observer(({ ux, info }) => {
    if (info.question.isMultipleChoice) { return null; }
    const displayingFlag = !ux.scores.hasFinishedGrading && info.remaining > 0;

    return (<Footer>
        <strong>
            Average score: {info.averagePoints ? ScoresHelper.formatPoints(info.averagePoints) : 'n/a'}
        </strong>
        {ux.canDisplayGradingButton &&
            <GradeButton
                className={cn('btn btn-new-flag',
                    {
                        'btn-primary': !ux.scores.hasFinishedGrading,
                        'btn-standard': !ux.scores.hasFinishedGrading,
                        'btn-new-flag': !ux.scores.hasFinishedGrading,
                        'btn-link': ux.scores.hasFinishedGrading,
                    })}
                to="gradeAssignmentQuestion"
                params={{
                    courseId: ux.course.id,
                    id: ux.planId,
                    periodId: ux.selectedPeriod.id,
                    questionId: `${info.id}`,
                }}
                displayingFlag={displayingFlag}
            >
                {displayingFlag && <span className="flag">{info.remaining} NEW</span>}
                <span>{ux.scores.hasFinishedGrading ? 'Regrade' : 'Grade Answers'}</span>
            </GradeButton>
        }
    </Footer>);
});
QuestionHeader.propTypes = {
    styleVariant: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    info: PropTypes.object.isRequired,
};

const StyledQuestionFreeResponse = styled.div`
  &:not(:last-child) {
    margin-bottom: 1.6rem;
  }
  display: flex;
  align-items: stretch;
  > * {
    padding-bottom: 1.6rem;
  }
  .name {
    align-self: flex-start;
    margin-right: 2.4rem;
    min-width: 15rem;
    width: 15rem;
    overflow-wrap: break-word;
    text-align: right;
    font-weight: normal;
    line-height: 2.5rem;
    color: ${colors.neutral.thin};
  }
  .resp {
    flex-grow: 1;
    margin: 0;
    font-size: 1.6rem;
    line-height: 2.5rem;
    white-space: pre-wrap;
  }
  &:not(:only-child):not(:last-child) .resp {
    border-bottom: 1px solid ${colors.neutral.light};
  }

  ${props => props.wrq && css`
    padding: 2.6rem;
    margin-bottom: 0;
    > :first-child {
      padding: 1.4rem 3.6rem 1.4rem 1.4rem;
      flex-grow: 1;
    }
    .name {
      text-align: left;
      width: auto;
      font-weight: bold;
    }
    .resp {
      padding: 2.2rem 0;
      display: flex;
      align-items: stretch;

      p { margin: 0; }
    }
    .grade {
      border-left: 1px solid ${colors.neutral.pale};
      color: ${colors.neutral.thin};
      line-height: 2rem;
      width: 240px;
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 0 0 0 1.4rem;
      ${props => props.longResponse && css`
        align-items: flex-start;
        padding-top: 1.4rem;
      `}

      h3 {
        font-size: 3.2rem;
        line-height: 4.8rem;
        margin-bottom: 1rem;
        color: ${colors.neutral.darker};
      }
    }
  `}
`;

const ResponseWrapper = styled.div`
  border: 1px solid ${colors.neutral.pale};
  background: #fff;
  margin-bottom: 2rem;
  ${props => !props.wrq && css`
    > * {
      padding: 1.8rem 5rem 1.8rem 2rem;
    }
  `}
`;

const ResponseHeader = styled.div`
  border-bottom: 1px solid ${colors.neutral.pale};
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  > *:first-child {
    margin-right: 1.6rem;
  }
`;

const MCQFreeResponse = observer(({ ux, question }) => (
    question.answers.map((answer, i) => {
        const responses = ux.scores.students.map((student, i) => {
            const studentQuestion = student.questions.find(sq => sq.selected_answer_id == answer.id);
            return (studentQuestion && studentQuestion.free_response) && (
                <StyledQuestionFreeResponse key={i} data-student-id={student.id}>
                    <div
                        className="name"
                        data-test-id="wrq-response-student-name"
                    >
                        {ux.getStudentName(student)}
                    </div>
                    <div className="resp">{studentQuestion.free_response}</div>
                </StyledQuestionFreeResponse>
            );
        });

        if (isEmpty(compact(responses))) { return null; }

        return (
            <ResponseWrapper key={`answer-${answer.id}`}>
                <ResponseHeader>
                    <span className={cn('letter', { 'green': answer.isCorrect, 'red': !answer.isCorrect })}>
                        {ALPHABET[i]}
                    </span>
                    <ArbitraryHtmlAndMath
                        html={answer.content_html}
                    />
                </ResponseHeader>
                <div>
                    {responses}
                </div>
            </ResponseWrapper>
        );
    })
));

const WRQFreeResponse = observer(({ ux, info }) => {
    const responses = info.responses.map((response, i) => {
        const student = response.student;
        return response.free_response && (
            <ResponseWrapper key={i} wrq={true}>
                <StyledQuestionFreeResponse
                    data-student-id={student.id}
                    wrq={true}
                    longResponse={response.free_response.length > 2000}
                >
                    <div>
                        <div
                            className="name"
                            data-test-id="wrq-response-student-name"
                        >
                            {ux.getStudentName(student)}
                        </div>
                        <div className="resp">
                            <p>{response.free_response}</p>
                        </div>
                    </div>
                    <div className="grade">
                        {response.needs_grading && 'Not graded'}
                        {!isNaN(response.grader_points) &&
                            <div>
                                <h3>{ScoresHelper.formatPoints(response.grader_points)}</h3>
                                {response.grader_comments}
                            </div>}
                    </div>
                </StyledQuestionFreeResponse>
            </ResponseWrapper>
        );
    });

    if (isEmpty(compact(responses))) { return null; }

    return (
        <div key={`wrq-responses-${info.question.id}`}>
            {responses}
        </div>
    );
});

const QuestionFreeResponse = observer(({ ux, info }) => {
    if (!ux.isShowingFreeResponseForQuestion(info.question)) { return null; }
    return (
        <div data-test-id="student-free-responses">
            {info.question.isMultipleChoice ? <MCQFreeResponse ux={ux} question={info.question} />
                : <WRQFreeResponse ux={ux} info={info} />}
        </div>
    );
});

const StyledStickyTable = styled(StickyTable)`
  .sticky-table-table {
    border: 1px solid ${colors.neutral.pale};
  }

  .sticky-table-cell {
    &:not(:last-child) {
      border-right: 1px solid ${colors.neutral.pale};
    }
    &:not(:first-child) {
      text-align: center;
    }
  }

  .sticky-table-cell, .sticky-table-row {
    vertical-align: middle;
    padding: 0 1.6rem;
    height: 4.1rem;
    border-color: ${colors.neutral.pale};
  }
`;

const Header = styled(Cell)`
  background: ${colors.assignments.submissions.background};
  color: ${colors.neutral.grayblue};
  ${props => props.center && 'text-align: center;'}
`;

const Legend = styled.div`
  margin: 0.8rem 0;
  color: ${colors.neutral.thin};
`;

const Toolbar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 0.8rem;
  p {
    margin: 0.8rem 0 0 0;
  }
`;

const GradeButton = styled(TutorLink)`
  &&& {
    padding: 1.5rem 2.1rem 1.5rem;
    line-height: 1.9rem;
    ${props => props.displayingFlag && 'padding-left: 1.1rem;'}
    &.btn-link {
      font-size: 1.6rem;
      padding: 0.5rem;
    }
  }
`;

const StyledNoActivity = styled.div`
  padding: 20px;
  p {
    margin-top: 10px;
  }
`;

const StyledTopicHeader = styled.div`
  display: flex;
  justify-content: space-between;
  h3 {
    font-weight: 600;
    line-height: 30px;
    padding-top: 8px;
    color: ${colors.dark_blue};
  }

  & + & {
    margin-top: 8px;
  }
`;

const QuestionsHeader = styled.div`
    padding-top: 20px;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid ${colors.neutral.pale};
`;

const StyledNamesToogleButton = styled(Button)`
  &&& {
    margin-left: auto;
    border: 1px solid ${colors.neutral.pale};
    background: transparent;
    color: ${colors.neutral.grayblue};
    padding: 10px 20px 10px 10px;

    span {
      margin-left: 5px;
    }
  }
`;

const ShuffleAnswerChoicesNote = styled.div`
  color: ${Theme.colors.neutral.grayblue};
  background: ${Theme.colors.neutral.bright};
  border: 1px solid ${Theme.colors.neutral.pale};
  display: flex;
  align-items: center;
  padding: 8px;
`;

const GradingBlock = observer(({ ux }) => {
    if (!ux.canDisplayGradingButton) { return null; }

    return (
        <Toolbar>
            <GradeButton
                data-test-id="grade-answers-btn"
                to="gradeAssignment"
                className="btn btn-primary btn-new-flag btn-standard"
                displayingFlag={ux.gradeableQuestionCount > 0}
                params={{
                    courseId: ux.course.id,
                    id: ux.planId,
                    periodId: ux.selectedPeriod.id,
                }}
            >
                {ux.gradeableQuestionCount > 0 &&
                    <span className="flag">{ux.gradeableQuestionCount} NEW</span>}
                <span>Grade answers</span>
            </GradeButton>
            <p>This assignment is now open for grading.</p>
        </Toolbar>
    );
});

const AvailablePoints = ({ value, heading = false }) => {
    if (value === false) {
        // Icon's defaultTooltipProps plus popperConfig
        const tooltipProps = {
            placement: 'auto',
            trigger: ['hover', 'focus'],
            popperConfig: { modifiers: { preventOverflow: { enabled: true } } },
        };

        const infoIcon = (
            <InfoIcon
                color="#f36a31"
                tooltip="Students received different numbers of Tutor-selected questions.  This can happen when questions aren’t
        available, a student works an assignment late, or a student hasn’t started the assignment."
                tooltipProps={tooltipProps}
            />
        );

        if (heading) {
            return infoIcon;
        }
        else {
            return (<Cell>{infoIcon}</Cell>);
        }
    }

    if (heading) {
        return (<strong>({ScoresHelper.formatPoints(value)})</strong>);
    }
    else {
        return (<Cell>{ScoresHelper.formatPoints(value)}</Cell>);
    }
};
AvailablePoints.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.bool,
    ]),
};

const StyledButton = styled(Button)`
  && { text-decoration: underline; }
`;

const StyledCell = styled(Cell)`
  ${props => props.isTrouble && css`
    background: ${colors.states.trouble};
  `}
`;

const SectionInfo = observer((props) => (
    <div className="section-link-wrapper singular">
        <SectionLink {...props} />
    </div>
));

const NamesToogleButton = observer(({ ux }) => (
    <StyledNamesToogleButton variant="default" onClick={ux.toogleNameVisibility} data-test-id="names-toogle-button">
        <Icon type={ux.hideStudentsName ? 'eye' : 'eye-slash'}
        />
        <span data-test-id="names-toogle-button-text">{ux.hideStudentsName ? 'Show' : 'Hide'} student names</span>
    </StyledNamesToogleButton>
));

const HomeworkQuestionsWrapper = ({ ux, questionsInfo }) => (
    <HomeworkQuestions
        questionsInfo={questionsInfo}
        questionType="teacher-review"
        sectionLinkRenderer={(props) => <SectionInfo ux={ux} {...props} />}
        headerContentRenderer={(props) => <QuestionHeader ux={ux} {...props} />}
        questionInfoRenderer={(props) => <QuestionFreeResponse ux={ux} {...props} />}
        footerContentRenderer={(props) => <QuestionFooter ux={ux} {...props} />}
        styleVariant={ux.planScores.isReading ? 'reading' : 'submission'} />
);
HomeworkQuestionsWrapper.propTypes = {
    ux: PropTypes.object.isRequired,
    questionsInfo: PropTypes.any.isRequired,
};

const ShuffleAnswerChoicesEnabled = observer(({ ux }) => {
    if (!ux.planScores.grading_template.shuffle_answer_choices) { return null; }
    return (
        <ShuffleAnswerChoicesNote>
            <strong>Note:</strong>&nbsp;Assignment display may differ for students.
            <InfoIcon
                tooltip="This page shows questions and answers in the same order as when the assignment was built. Answer choice order may have been randomized for students. Responses are summarized by student answer choice."
            />
        </ShuffleAnswerChoicesNote>
    );
});

const QuestionList = observer(({ ux }) => {
    const { scores } = ux

    if (!ux.isExercisesReady) { return <Loading message="Loading Questions…" />; }
    if (!scores) { return null }

    if (scores.questionsInfo && scores.questionsInfo.length === 0) {
        return (
            <StyledNoActivity>
                <h2>No activity yet</h2>
                <p>No activity has been recorded for this section yet. Once students start to work the assignment their activity will appear.</p>
            </StyledNoActivity>
        );
    }

    if (ux.planScores.isReading) {
        const header = (key, index) => {
            const toolbar = (
                <>
                    <ShuffleAnswerChoicesEnabled ux={ux} />
                    <NamesToogleButton ux={ux} />
                </>
            )
            const title = (
                <h3>
                    <ArbitraryHtmlAndMath html={key} />
                </h3>
            )

            const { shuffle_answer_choices } = ux.planScores.grading_template;

            return (
                <>
                    <StyledTopicHeader>
                        {!shuffle_answer_choices && title}
                        {/** Only the show the button at the top with the very first header */}
                        {index === 0 && toolbar}
                    </StyledTopicHeader>
                    {shuffle_answer_choices && <StyledTopicHeader>{title}</StyledTopicHeader>}
                </>
            )
        };

        const personalizedQuestions = Object.keys(scores.questionsGroupedByPageTopic).map((key, index) => (
            <div key={index}>
                {header(key, index)}
                <HomeworkQuestionsWrapper
                    questionsInfo={scores.questionsGroupedByPageTopic[key]}
                    ux={ux}
                />
            </div>
        ))


        const spacedPracticeQuestions = (
            <div key="spaced-practice">
                <StyledTopicHeader>
                    <h3>Spaced Practice</h3>
                </StyledTopicHeader>
                <HomeworkQuestionsWrapper
                    questionsInfo={scores.spacedPracticeQuestions}
                    ux={ux}
                />
            </div>
        )

        return (
            <>
                {personalizedQuestions}
                {scores.spacedPracticeQuestions.length > 0 && spacedPracticeQuestions}
            </>
        );
    }

    return (
        <>
            <QuestionsHeader>
                <ShuffleAnswerChoicesEnabled ux={ux} />
                <NamesToogleButton ux={ux} />
            </QuestionsHeader>
            <HomeworkQuestionsWrapper
                questionsInfo={scores.questionsInfo}
                ux={ux}
            />
        </>
    );

});
QuestionList.propTypes = {
    ux: PropTypes.object.isRequired,
    scores: PropTypes.any.isRequired,
};


const HomeWorkInfo = observer(({ ux }) => (
    <>
        <GradingBlock ux={ux} />
        <StyledStickyTable>
            <Row>
                <Header>Question Number</Header>
                {ux.scores.question_headings.map((h, i) =>
                    <Header key={i} center={true}>
                        <DroppedQuestionHeadingIndicator heading={h} preventOverflow={false} />
                        {h.isCore ?
                            <StyledButton variant="link" onClick={() => ux.scrollToQuestion(h.question_id, i)}>
                                {i + 1}
                            </StyledButton> : i + 1}
                    </Header>)}
            </Row>
            <Row>
                <Header>Question Type</Header>
                {ux.scores.question_headings.map((h, i) => <Cell key={i}>{h.type}</Cell>)}
            </Row>
            <Row>
                <Header>
                    Available Points <AvailablePoints value={(ux.scores.hasEqualQuestions && ux.scores.availablePoints) || false} heading />
                </Header>
                {ux.scores.question_headings.map((heading, i) => {
                    let value = false;
                    if (
                        heading.type != 'Tutor' ||
                        !heading.droppedQuestions.some(dq => dq.drop_method == 'zeroed')
                    ) value = heading.points;

                    return (<AvailablePoints value={value} key={i} />);
                })}
            </Row>
            <Row>
                <Header>Correct Responses</Header>
                {ux.scores.question_headings.map((h, i) => (
                    <StyledCell key={i} isTrouble={h.isTrouble}>
                        {h.humanCorrectResponses}
                    </StyledCell>
                ))}
            </Row>
        </StyledStickyTable>
        <Legend>
            MCQ: Multiple Choice Question (auto-graded);
            WRQ: Written Response Question (manually-graded);
            Tutor: OpenStax Tutor Beta selection (MCQs and auto-graded)
        </Legend>
    </>
));

const Overview = observer(({ ux }) => {

    return (
        <Wrapper data-test-id="overview">
            {ux.planScores.isHomework && <HomeWorkInfo ux={ux} />}
            <QuestionList ux={ux} />
            <DropQuestionModal ux={ux} />
        </Wrapper>
    );

});

Overview.title = 'Submission Overview';
Overview.propTypes = {
    ux: PropTypes.object.isRequired,
};


export default Overview;
