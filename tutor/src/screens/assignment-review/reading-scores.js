import { React, PropTypes, styled, observer, css } from 'vendor';
import { StickyTable, Row, Cell as TableCell } from 'react-sticky-table';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Icon } from 'shared';
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
import { EIcon } from '../../components/icons/extension';

// https://projects.invisionapp.com/d/main#/console/18937568/401942280/preview

const StyledStickyTable = styled(StickyTable)`
  margin: 2.2rem 0 1.4rem;

  .sticky-table-row:last-child .sticky-table-cell {
    border-bottom: 1px solid ${colors.neutral.pale};
  }
`;

const Cell = styled(TableCell)`
  padding: 0;
  border-width: 1px;
  border-color: transparent;
  border-left: 1px solid ${colors.neutral.pale};
  cursor: ${props => props.onClick || props.clickable ? 'pointer' : 'inherit'};
  &:last-child {
    border-right: 1px solid ${colors.neutral.pale};
  }
  ${props => props.striped && css`
    background: ${colors.neutral.lighter};
  `}
  && {
    ${props => props.isTrouble && isTroubleCSS}
  }
`;

const centeredCSS = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const paddingCSS = css`
  padding: 1.2rem 1.6rem;
`;

const CellContents = styled.div`
  ${centeredCSS}
  > * { width: 80px; }
  > *:first-child {
    width: 16rem;
  }
  .data-heading {
    height: 110px;
  }
`;

const Heading = styled.div`
  ${props => !props.first && centeredCSS}
  ${props => props.first && !props.noBorder && css`
    border-right: 1px solid ${colors.neutral.pale};
  `}
  ${paddingCSS}
`;

const HeadingTop = styled.div`
  ${paddingCSS}
  padding-top: 1.2rem;
  align-self: stretch;
  font-weight: bold;
  cursor: pointer;
`;

const HeadingMiddle = styled.div`
  ${paddingCSS}
  align-self: stretch;
  padding-top: 0;
  font-size: 1rem;
  color: ${colors.neutral.thin};
`;

const HeadingBottom = styled.div`
  ${paddingCSS}
  align-self: stretch;
  font-size: 1.2rem;
  line-height: 1.4rem;
  color: ${colors.neutral.thin};
  background: #fff;
  position: relative;
`;

const ColumnHeading = styled.div`
  background: ${props => props.variant === 'q' ? colors.templates.reading.background : colors.neutral.lighter};
  border-top: 0.4rem solid ${props => props.variant === 'q' ? colors.templates.reading.border : colors.neutral.std};
  cursor: ${props => props.onClick || props.clickable ? 'pointer' : 'inherit'};
  &:not(:last-child) {
    border-right: 1px solid ${colors.neutral.pale};
  }
  > * {
    ${props => !props.first && css`
      ${centeredCSS}
    `}
  }
  .middle-data-heading {
    padding-top: 15px;
  }
  .bottom-data-heading {
    height: 40px;
  }
`;

const ColumnFooter = styled.div`

  &:not(:last-child) {
    border-right: 1px solid ${colors.neutral.pale};
  }
  > * {
    /* TODO change to 1.6rem across the board */
    font-size: 1.4rem;
    ${props => !props.first && css`
      ${centeredCSS}
    `}
  }
`;

const SplitCell = styled.div`
  ${centeredCSS}
  flex: 1.0;
  font-size: 1.4rem;
  ${props => props.variant != 'active' && `color: ${colors.link};`}
  ${props => props.variant == 'divider' && `color: ${colors.neutral.pale};`}
  ${props => props.variant != 'divider' && 'cursor: pointer;'}
`;

const LateWork = styled.div`
  padding: 0;
  ${centeredCSS}
  align-self: stretch;
  position: relative;

  .extension-icon {
    position: absolute;
    right: 1rem;
  }
`;

const Total = styled.div`
  padding: 0;
  align-self: stretch;
  border-right: 1px solid  ${colors.neutral.pale};
  ${centeredCSS}
`;

const isTroubleCSS = css`
  background-color: ${colors.states.trouble};
  border-top: 1px solid ${colors.danger};
  border-bottom: 1px solid ${colors.danger} !important;
`;

const DefinitionsWrapper = styled.div`
  margin: 1.4rem 0;
  ol {
    margin-top: 8px;
    padding-left: 15px;
    
    li:not(:first-child) {
      margin-top: 8px;
      .extension-icon {
        display: inline-block;
      }
    }
  }
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

const OrderIcon = styled(Icon)`
  &&.btn {
    transition: none;
    font-size: 1.2rem;
    line-height: 1.2rem;

    &:hover, &:focus {
      box-shadow: none;
    }
  }
`;

const StudentColumnHeader = observer(({ ux }) => (
  <Cell leftBorder={true}>
    <CellContents>
      <ColumnHeading first={true}>
        <HeadingTop
          onClick={() => ux.changeRowSortingOrder(0, 'name')}
          aria-label="Sort by student name"
          role="button"
        >
          Student Name
          <SortIcon sort={ux.sortForColumn(0, 'name')} />
        </HeadingTop>
        <HeadingMiddle>
          {ux.nameOrderHeader}
          <OrderIcon
            variant="toggleOrder"
            onClick={ux.toggleNameOrder}
            aria-label="Toggle firstname lastname order"
          />
        </HeadingMiddle>
        <HeadingBottom style={{ padding: '19px' }} />
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


const StudentCell = observer(({ ux, student, striped }) => {
  const countData = ux.getReadingCountData(student);
  return (
    <>
      <Cell striped={striped}>
        <CellContents>

          <Heading first={true}>
            <TutorLink
              to="viewTask"
              params={{
                courseId: ux.course.id,
                id: student.task_id,
              }}
            >
              {ux.reverseNameOrder ? student.reversedName : student.name}
            </TutorLink>
          </Heading>

          <Total>
            {ux.displayTotalInPercent ?
              `${S.asPercent(student.total_fraction || 0)}%` :
              S.numberWithOneDecimalPlace(student.total_points)}
          </Total>
          <LateWork>
            {student.late_work_point_penalty ? `-${S.numberWithOneDecimalPlace(student.late_work_point_penalty)}` : '0'}
            {ux.wasGrantedExtension(student.role_id) && <ExtensionIcon />}
          </LateWork>
        </CellContents>
      </Cell>
      <Cell striped={striped}>
        <CellContents>
          {countData.complete} of {countData.total}
        </CellContents>
      </Cell>
      <Cell striped={striped}>
        <CellContents>
          {countData.correct} of {countData.complete}
        </CellContents>
      </Cell>
      <Cell striped={striped}>
        <CellContents>
          {countData.incorrect} of {countData.complete}
        </CellContents>
      </Cell>
    </>
  );
});


const AssignmentHeading = ({ headingName }) => (
  <Cell>
    <ColumnHeading className="data-heading" variant="q">
      <HeadingTop>
        {headingName}
      </HeadingTop>
      <HeadingMiddle className="middle-data-heading" />
      <HeadingBottom className="bottom-data-heading" />
    </ColumnHeading>
  </Cell>
);
AssignmentHeading.propTypes = {
  headingName: PropTypes.string.isRequired,
};

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
          {ux.overallAverageScore}
        </Heading>
      </ColumnFooter>
      <ColumnFooter />
    </CellContents>
  </Cell>
));


const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 3rem;
`;

const ControlGroup = styled.div`
  display: flex;

  .input-group {
    width: 25.6rem;

    input {
      height: 3.8rem;
    }
  }

  && {
    > *:not(:first-child), > .btn + .btn {
      margin-left: 1.6rem;
    }
    .btn:not(.btn-icon) {
      height: 4rem;
      min-width: 17rem;
    }
  }
`;

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

const ReadingScores = observer(({ ux }) => {
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
          {['Completed', 'Correct', 'Incorrect'].map(h => <AssignmentHeading headingName={h} />)}
        </Row>
        {ux.sortedStudents.map((student,sIndex) => (
          <Row key={sIndex}>
            <StudentCell ux={ux} student={student} striped={0 === sIndex % 2} />
          </Row>))}
        <Row>
          <AverageScoreHeader ux={ux} />
          <Cell />
          <Cell />
          <Cell />
        </Row>
      </StyledStickyTable>
      <DefinitionsWrapper>
        <strong>NOTE</strong>
        <ol>
          <li>The late penalty is applied only to the points earned after the due date. <a href="https://openstax.org/blog/new-openstax-tutor-scoring-feature" target="_blank">Learn more</a></li>
          <li>Students who’ve been granted an extension are denoted with <EIcon /></li>
        </ol>
      </DefinitionsWrapper>
    </>
  );
});

ReadingScores.title = 'Reading Assignment Scores';

ReadingScores.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default ReadingScores;
