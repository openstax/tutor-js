import { React, PropTypes, styled, observer } from 'vendor';
import { Icon } from 'shared';
import { Row } from 'react-sticky-table';

import LoadingScreen from 'shared/components/loading-animation';
import { colors } from 'theme';
import ScoresHelper, { UNWORKED } from '../../helpers/scores';
import ExtensionIcon, { EIcon } from '../../components/icons/extension';
import InfoIcon from '../../components/icons/info';
import SortIcon from '../../components/icons/sort';
import SearchInput from '../../components/search-input';
import TutorLink from '../../components/link';
import {
    DroppedQuestionHeadingIndicator, DroppedTutorQuestionIndicator, DroppedIcon,
} from '../../components/dropped-question';
import GrantExtension from './grant-extension';
import PublishScores from '../../components/buttons/publish-scores';
import ResultTooltip from './result-tooltip';
import TourRegion from '../../components/tours/region';
import { GhostButton } from '../../components/ghost-button';
import UiSettings from 'shared/model/ui-settings';

import {
    StyledStickyTable, Cell, CellContents,
    Heading, HeadingTop, HeadingMiddle, HeadingBottom,
    SplitCell, ColumnHeading as BasicColumnHeading,
    LateWork, Total, ColumnFooter,
    TableBottom, Definitions, Entry, Term, Definition,
    ControlsWrapper, ControlGroup,
    OrderIcon, NameWrapper,
} from './table-elements';

const ORANGE_INFO_ICON = (
    <InfoIcon
        color="#f36a31"
        tooltip="Students received different numbers of Tutor-selected questions.
        This can happen when questions aren’t available, a student works an assignment late,
        a student hasn’t started the assignment, or a personalized question is dropped."
    />
);

const ColumnHeading = styled(BasicColumnHeading)`
  background: ${props => props.variant === 'q' ? colors.templates.homework.background : colors.neutral.lighter};
`;

const ResultWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UngradedIcon = styled.span`
  color: ${colors.neutral.std};
  font-size: 1.2rem;
  line-height: 1.4rem;
  letter-spacing: 0.38px;
`;

const TotalPointsHeading = observer(({ ux }) => {
    if (ux.scores.hasEqualQuestions) {
        return (<span>{ScoresHelper.formatPoints(ux.scores.availablePoints)}</span>);
    }

    return ORANGE_INFO_ICON;
});

const AssignmentHeadingPoints = observer(({ heading }) => {
    let cellContents;

    if (!heading.someQuestionsDropped ||
        heading.everyQuestionZeroed ||
        heading.everyQuestionFullCredit) {
        cellContents = (<span>{ScoresHelper.formatPoints(heading.points)}</span>);

        if (!heading.someQuestionsDropped) {
            return cellContents;
        }
    }
    else {
        cellContents = ORANGE_INFO_ICON;
    }

    return (
        <>
            {heading.isCore && <DroppedQuestionHeadingIndicator heading={heading} />}
            {cellContents}
        </>
    );
});

const StudentColumnHeader = observer(({ ux }) => (
    <Cell leftBorder={true}>
        <CellContents>
            <ColumnHeading first={true}>
                <HeadingTop
                    onClick={() => ux.changeRowSortingOrder(0, ux.reverseNameOrder ? 'first_name' : 'name')}
                    aria-label="Sort by student name"
                    role="button"
                >
                    Student Name
                    <SortIcon sort={ux.sortForColumn(0, ux.reverseNameOrder ? 'first_name' : 'name')} />
                </HeadingTop>
                <HeadingMiddle>
                    {ux.nameOrderHeader}
                    <OrderIcon
                        variant="toggleOrder"
                        onClick={ux.toggleNameOrder}
                        aria-label="Toggle firstname lastname order"
                    />
                </HeadingMiddle>
                <HeadingBottom>
                    Available Points
                </HeadingBottom>
            </ColumnHeading>
            <ColumnHeading>
                <HeadingTop
                    onClick={() => ux.changeRowSortingOrder(0, 'total')}
                    aria-label="Sort by student total"
                    role="button"
                >
          Total
                    <SortIcon sort={ux.sortForColumn(0, 'total')} />
                </HeadingTop>
                <HeadingMiddle>
                    <SplitCell
                        variant={!ux.displayTotalInPercent ? 'active' : ''}
                        onClick={() => ux.displayTotalInPercent = false}
                        aria-label="Display total in points"
                        role="button"
                    >
                        #
                    </SplitCell>
                    <SplitCell variant="divider">
            |
                    </SplitCell>
                    <SplitCell
                        variant={ux.displayTotalInPercent ? 'active' : ''}
                        onClick={() => ux.displayTotalInPercent = true}
                        aria-label="Display total in percent"
                        role="button"
                    >
                        %
                    </SplitCell>
                </HeadingMiddle>
                <HeadingBottom>
                    <TotalPointsHeading ux={ux} />
                </HeadingBottom>
            </ColumnHeading>
            <ColumnHeading>
                <HeadingTop>
                    Late work
                </HeadingTop>
                <HeadingMiddle>
                    {ux.planScores.grading_template.humanLateWorkPenaltyApplied}
                </HeadingMiddle>
                <HeadingBottom>
                    {ux.planScores.grading_template.humanLateWorkPenalty}
                </HeadingBottom>
            </ColumnHeading>
        </CellContents>
    </Cell>
));

const StudentCell = observer(({ ux, student, striped, border }) => (
    <Cell striped={striped} border={border}>
        <CellContents>
            <NameWrapper first>
                <TutorLink
                    to="viewTask"
                    params={{
                        courseId: ux.course.id,
                        id: student.task_id,
                    }}
                >
                    {ux.reverseNameOrder ? student.reversedName : student.name}
                </TutorLink>
            </NameWrapper>
            <Total>
                {ux.displayTotalInPercent ?
                    student.humanTotalFraction : ( ux.scores.hasEqualQuestions ?
                        student.humanTotalPoints : student.humanTotalWithAvailablePoints)}
            </Total>
            <LateWork>
                {student.late_work_point_penalty ?
                    `${ScoresHelper.formatLatePenalty(student.late_work_point_penalty)}` : '0'}
                {ux.wasGrantedExtension(student.role_id) &&
          <ExtensionIcon extension={student.extension} timezone={ux.course.timezone} />}
            </LateWork>
        </CellContents>
    </Cell>
));


const AssignmentHeading = observer(({ ux, heading }) => (
    <Cell onClick={() => ux.changeRowSortingOrder(heading.index, 'question')}>
        <ColumnHeading variant="q">
            <HeadingTop>
                {heading.title}
                <SortIcon sort={ux.sortForColumn(heading.index, 'question')} />
            </HeadingTop>
            <HeadingMiddle>
                {heading.type}
            </HeadingMiddle>
            <HeadingBottom>
                <AssignmentHeadingPoints heading={heading} />
            </HeadingBottom>
        </ColumnHeading>
    </Cell>
));

const TaskResult = observer(({ heading, result, striped }) => {
    let body;

    if (!result) {
        body = 'n/a';
    } else if (result.needs_grading) {
        body = (
            <>
                {result.submitted_late && <Icon variant="lateWork" />}
                <UngradedIcon>{result.displayValue}</UngradedIcon>
            </>
        );
    } else if (result.submitted_late) {
        body = (
            <ResultTooltip result={result}>
                {result.submitted_late && <Icon variant="lateWork" />}
                {result.displayValue}
            </ResultTooltip>
        );
    } else {
        body = result.displayValue;
    }

    return (
        <Cell
            striped={striped}
            isTrouble={result && !result.isUnattemptedAutoZero && result.isTrouble}
            isUnattemptedAutoZero={result && result.isUnattemptedAutoZero}
        >
            {!heading.isCore && <DroppedTutorQuestionIndicator result={result} />}
            <ResultWrapper>
                {body}
            </ResultWrapper>
        </Cell>
    );
});

const AverageScoreHeader = observer(({ ux }) => (
    <Cell leftBorder={true}>
        <CellContents>
            <ColumnFooter first={true}>
                <Heading first={true} noBorder={true}>
          Average score
                </Heading>
            </ColumnFooter>
            <ColumnFooter>
                <Heading>
                    {ux.scores.totalAverageScoreInPercent}
                </Heading>
            </ColumnFooter>
            <ColumnFooter>
                <Heading>
          n/a
                </Heading>
            </ColumnFooter>
        </CellContents>
    </Cell>
));

const TableHeader = observer(({ ux, showGhostButton }) => {
    return (
        <ControlsWrapper>
            <ControlGroup>
                <SearchInput onChange={ux.onSearchStudentChange} />
                <GrantExtension ux={ux} />
                {showGhostButton &&
                 <GhostButton tourAnchorId="drop-question-relocated-button" />}
            </ControlGroup>
            <ControlGroup>
                <PublishScores ux={ux} />
            </ControlGroup>
        </ControlsWrapper>
    );
});
TableHeader.propTypes = {
    ux: PropTypes.object.isRequired,
};

const Scores = observer(({ ux }) => {
    const { scores } = ux;

    if (!ux.isExercisesReady) {
        return <LoadingScreen message="Loading Assignment…" />;
    }

    const showGhostButton = !UiSettings.get('has-viewed-drop-question-relocated');

    return (
        <TourRegion id="drop-any-relocated">
            <TableHeader ux={ux} showGhostButton={showGhostButton} />
            <StyledStickyTable data-test-id="scores">
                <Row>
                    <StudentColumnHeader scores={scores} ux={ux} />
                    {scores.question_headings.map((h, i) => <AssignmentHeading ux={ux} key={i} heading={h} />)}
                </Row>
                {ux.sortedStudents.map((student,sIndex) => (
                    <Row key={sIndex}>
                        <StudentCell ux={ux} student={student} striped={0 === sIndex % 2} border={false} />
                        {scores.question_headings.map((heading, i) => (
                            <TaskResult
                                key={i}
                                index={i}
                                ux={ux}
                                heading={heading}
                                result={student.resultForHeading(heading)}
                                striped={0 === sIndex % 2}
                            />
                        ))}
                    </Row>))}
                <Row>
                    <AverageScoreHeader ux={ux} />
                    {scores.question_headings.map((h, i) => (
                        <Cell key={i}>
                            <ResultWrapper>
                                {isNaN(h.averageGradedPoints) && UNWORKED ||
                  ScoresHelper.formatPoints(h.averageGradedPoints)}
                            </ResultWrapper>
                        </Cell>
                    ))}
                </Row>
            </StyledStickyTable>
            <TableBottom>
                <Definitions>
                    <Entry wide={true}>
                        <Term aria-label="Not yet attempted">{UNWORKED}</Term>
                        <Definition>Question not yet attempted</Definition>
                    </Entry>
                    <Entry>
                        <Term variant="icon" aria-label="Extension"><EIcon /></Term>
                        <Definition>Extension granted</Definition>
                    </Entry>
                    <Entry>
                        <Term variant="icon" aria-label="Late"><Icon variant="lateWork" /></Term>
                        <Definition>Late work</Definition>
                    </Entry>
                    <Entry wide={true}>
                        <Term variant="unattempted" aria-label="Unattempted"></Term>
                        <Definition>Question not attempted, 0 points auto-assigned</Definition>
                    </Entry>
                    <Entry>
                        <Term variant="icon" aria-label="Dropped"><DroppedIcon color="blue" /></Term>
                        <Definition>Dropped question</Definition>
                    </Entry>
                    <Entry>
                        <Term variant="icon" aria-label="Ungraded"><UngradedIcon>UG</UngradedIcon></Term>
                        <Definition>Ungraded</Definition>
                    </Entry>
                    <Entry wide={true}>
                        <Term variant="trouble" aria-label="Less than 50%"></Term>
                        <Definition>Scores less than 50% of question's point value</Definition>
                    </Entry>
                    <Entry>
                        <Term variant="icon" wide aria-label="Different # of questions">{ORANGE_INFO_ICON}</Term>
                        <Definition>Different # of Tutor-selected questions</Definition>
                    </Entry>
                </Definitions>
                <p>
                    <strong>Note:</strong> This page reflects both published and unpublished scores
          for an assignment. Scores may differ from the Gradebook, where only published
          scores are displayed. Students see their scores as they appear in your Gradebook.
                </p>
            </TableBottom>
        </TourRegion>
    );
});

Scores.title = 'Assignment Scores';

Scores.propTypes = {
    ux: PropTypes.object.isRequired,
};

export default Scores;
