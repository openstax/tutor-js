import { React, PropTypes, styled, observer, css } from 'vendor';
import { Row } from 'react-sticky-table';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import LoadingScreen from 'shared/components/loading-animation';
import { colors } from 'theme';
import S from '../../helpers/string';
import ExtensionIcon from '../../components/icons/extension';
import InfoIcon from '../../components/icons/info';
import SortIcon from '../../components/icons/sort';
import SearchInput from '../../components/search-input';
import TutorLink from '../../components/link';
import GrantExtension from './grant-extension';
import DropQuestions from './drop-questions';
import PublishScores from './publish-scores';

import {
  StyledStickyTable, Cell, CellContents,
  Heading, HeadingTop, HeadingMiddle, HeadingBottom,
  SplitCell, ColumnHeading as BasicColumnHeading,
  LateWork, Total, ColumnFooter,
  DefinitionsWrapper, Term, Definition,
  ControlsWrapper, ControlGroup,
  OrderIcon, NameWrapper,
} from './table-elements';

// https://projects.invisionapp.com/d/main#/console/18937568/401942280/preview

const ColumnHeading = styled(BasicColumnHeading)`
  background: ${props => props.variant === 'q' ? colors.templates.homework.background : colors.neutral.lighter};
`;

const Result = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CornerTriangle = ({ color, tooltip }) => {
  return (
    <OverlayTrigger
      placement="right"
      overlay={
        <Tooltip>
          {tooltip}
        </Tooltip>
      }
    >
      <StyledTriangle color={color} />
    </OverlayTrigger>
  );
};
CornerTriangle.propTypes = {
  color: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
};

const StyledTriangle = styled.div`
  height: 0;
  width: 0;
  position: absolute;
  top: 0;
  right: 0;
  border-style: solid;
  border-width: 0 1rem 1rem 0;
  border-color: transparent #000 transparent transparent;
  ${props => props.color === 'green' && css`
    border-color: transparent ${colors.assignments.scores.extension} transparent transparent;
  `}
  ${props => props.color === 'blue' && css`
    border-color: transparent ${colors.assignments.scores.dropped} transparent transparent;
  `}
`;

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
          {S.numberWithOneDecimalPlace(ux.scores.availablePoints)}
          {!ux.scores.hasEqualTutorQuestions && (
            <InfoIcon
              color="#f36a31"
              tooltip="Students received different numbers of Tutor-selected questions.  This can happen when questions aren’t available, a student works an assignment late, or a student hasn’t started the assignment."
            />
          )}
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

const StudentCell = observer(({ ux, student, striped }) => (
  <Cell striped={striped}>
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
        {ux.displayTotalInPercent ? student.humanTotalFraction : student.humanTotalPoints}
      </Total>
      <LateWork>
        {student.late_work_point_penalty ? `-${S.numberWithOneDecimalPlace(student.late_work_point_penalty)}` : '0'}
        {ux.wasGrantedExtension(student.role_id) && <ExtensionIcon />}
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
        {heading.dropped &&
          <CornerTriangle color="blue"
            tooltip={heading.dropped.drop_method == 'zeroed' ?
              'Points changed to 0' : 'Full credit given to all students'}
          />}
        {S.numberWithOneDecimalPlace(heading.displayPoints)}
      </HeadingBottom>
    </ColumnHeading>
  </Cell>
));

const TaskResult = observer(({ result, striped }) => {
  return (
    <Cell striped={striped} isTrouble={result && result.isTrouble}>
      <Result>
        {result ? result.displayValue : 'N/A'}
      </Result>
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

const TableHeader = observer(({ ux }) => {
  return (
    <ControlsWrapper>
      <ControlGroup>
        <SearchInput onChange={ux.onSearchStudentChange} />
        <GrantExtension ux={ux} />
        <DropQuestions ux={ux} />
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

  return (
    <>
      <TableHeader ux={ux} />
      <StyledStickyTable data-test-id="scores">
        <Row>
          <StudentColumnHeader scores={scores} ux={ux} />
          {scores.question_headings.map((h, i) => <AssignmentHeading ux={ux} key={i} heading={h} />)}
        </Row>
        {ux.sortedStudents.map((student,sIndex) => (
          <Row key={sIndex}>
            <StudentCell ux={ux} student={student} striped={0 === sIndex % 2} />
            {scores.question_headings.map((heading, i) => (
              <TaskResult
                key={i}
                index={i}
                ux={ux}
                result={student.resultForHeading(heading)}
                striped={0 === sIndex % 2}
              />
            ))}
          </Row>))}
        <Row>
          <AverageScoreHeader ux={ux} />
          {scores.question_headings.map((h, i) => (
            <Cell key={i}>
              <Result>
                {isNaN(h.responseStats.averageGradedPoints) && '---' ||
                  S.numberWithOneDecimalPlace(h.responseStats.averageGradedPoints)}
              </Result>
            </Cell>
          ))}
        </Row>
      </StyledStickyTable>
      <DefinitionsWrapper>
        <Term variant="trouble" aria-label="Less than 50%"></Term>
        <Definition>Scores less than 50% of question's point value</Definition>
        <Term aria-label="Unattempted">---</Term>
        <Definition>Unattempted question or ungraded responses</Definition>
      </DefinitionsWrapper>
    </>
  );
});

Scores.title = 'Assignment Scores';

Scores.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Scores;
