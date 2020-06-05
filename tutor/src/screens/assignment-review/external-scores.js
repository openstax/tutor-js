import { React, styled, observer, css } from 'vendor';
import { StickyTable, Row, Cell as TableCell } from 'react-sticky-table';
import { Icon } from 'shared';
import LoadingScreen from 'shared/components/loading-animation';
import { colors } from 'theme';
import SortIcon from '../../components/icons/sort';
import SearchInput from '../../components/search-input';
import TutorLink from '../../components/link';

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

  .external-fill {
      margin-top: 1px;
  }
`;

const ColumnHeading = styled.div`
  background: ${props => props.variant === 'q' ? colors.templates.external.background : colors.neutral.lighter};
  border-top: 0.4rem solid ${props => props.variant === 'q' ? colors.templates.external.border : colors.neutral.std};
  cursor: ${props => props.onClick || props.clickable ? 'pointer' : 'inherit'};
  &:not(:last-child) {
    border-right: 1px solid ${colors.neutral.pale};
  }
  > * {
    ${props => !props.first && css`
      ${centeredCSS}
    `}
  }
`;

const Result = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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

const ControlsWrapper = styled.div`
  display: flex;
  margin-top: 3rem;
  .input-group {
    width: 25.6rem;

    input {
      height: 3.8rem;
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
      </ColumnHeading>
    </CellContents>
  </Cell>
));


const StudentCell = observer(({ ux, student, striped }) => (
  <Cell striped={striped}>
    <CellContents>
      <Heading first={true}>
        <TutorLink
          to="viewTaskStep"
          params={{
            courseId: ux.course.id,
            id: student.task_id,
          }}
        >
          {ux.reverseNameOrder ? student.reversedName : student.name}
        </TutorLink>
      </Heading>
    </CellContents>
  </Cell>
));


const AssignmentHeading = observer(({ ux, heading }) => (
  <Cell onClick={() => ux.changeRowSortingOrder(heading.index, 'clicked')}>
    <ColumnHeading variant="q">
      <HeadingTop>
        {heading.title}
        <SortIcon sort={ux.sortForColumn(heading.index, 'clicked')} />
      </HeadingTop>
      <HeadingMiddle>
        <div className="external-fill">External Assignment</div>
      </HeadingMiddle>
    </ColumnHeading>
  </Cell>
));

const TaskResult = observer(({ result, striped }) => {
  return (
    <Cell striped={striped}>
      <Result>
        {result && result.is_completed ? 'clicked' : '---'}
      </Result>
    </Cell>
  );
});


const ExternalScores = observer(({ ux }) => {
  const { scores } = ux;

  if (!ux.isExercisesReady) {
    return <LoadingScreen message="Loading Assignment…" />;
  }

  return (
    <>
      <ControlsWrapper>
        <SearchInput onChange={ux.onSearchStudentChange} />
      </ControlsWrapper>
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
                ux={ux}
                result={student.resultForHeading(heading)}
                striped={0 === sIndex % 2}
              />
            ))}
          </Row>))}
      </StyledStickyTable>
    </>
  );
});
ExternalScores.title = 'Assignment Scores';

export default ExternalScores;
