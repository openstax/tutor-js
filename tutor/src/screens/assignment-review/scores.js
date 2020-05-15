import { React, PropTypes, styled, observer, css } from 'vendor';
import { StickyTable, Row, Cell as TableCell } from 'react-sticky-table';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Icon, AsyncButton } from 'shared';
import { colors } from 'theme';
import S from '../../helpers/string';
import SortIcon from '../../components/icons/sort';
import SearchInput from '../../components/search-input';
import GrantExtension from './grant-extension';
import DropQuestions from './drop-questions';

// https://projects.invisionapp.com/d/main#/console/18937568/401942280/preview

const StyledStickyTable = styled(StickyTable)`
  margin: 2.2rem 0 1.4rem;

  .sticky-table-row:last-child .sticky-table-cell {
    border-bottom: 1px solid ${colors.neutral.pale};
  }
`;

const Cell = styled(TableCell)`
  padding: 0;
  border-bottom: 0;
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

const headingCSS = css`
  height: 100%;
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
  ${props => props.first && css`
    border-right: 1px solid ${colors.neutral.pale};
  `}
  ${headingCSS}
  ${paddingCSS}
`;

const HeadingTop = styled.div`
  ${paddingCSS}
  padding-top: 1.2rem;
  align-self: stretch;
  font-weight: bold;
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
  font-size: 1rem;
  background: #fff;
  position: relative;
`;

const ColumnHeading = styled.div`
  ${headingCSS}
  background: ${props => props.variant === 'q' ? colors.templates.homework.background : colors.neutral.lighter};
  border-top: 0.4rem solid ${props => props.variant === 'q' ? colors.templates.homework.border : colors.neutral.std};
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

const SplitCell = styled.div`
  ${centeredCSS}
  flex: 1.0;
`;

const LateWork = styled.div`
  padding: 0;
  ${centeredCSS}
  align-self: stretch;
  position: relative;
`;

const Total = styled.div`
  padding: 0;
  align-self: stretch;
  border-right: 1px solid  ${colors.neutral.pale};
  ${centeredCSS}
`;

const isTroubleCSS = css`
  background-color: ${colors.states.trouble}
  border-color: ${colors.danger};
  border-top: 1px solid ${colors.danger};
  border-bottom: 1px solid ${colors.danger};
`;

const Result = styled.div`
  display: flex;
  height: 5rem;
  justify-content: center;
  align-items: center;
  ${props => props.isTrouble && isTroubleCSS}
`;

const StyledButton = styled(Button)`
  && { padding: 0; }
`;

const DefinitionsWrapper = styled.dl`
  margin: 1.4rem 0;
  display: flex;
  align-items: center;
  dd + dt {
    margin-left: 4.8rem;
  }
`;

const Term = styled.dt`
  border: 1px solid ${colors.neutral.light};
  ${props => props.variant === 'trouble' && isTroubleCSS}
  display: flex;
  justify-content: center;
  width: 5.6rem;
  height: 2.8rem;
  margin-right: 1.1rem;
  font-size: 1.6rem;
  line-height: 1.8rem;
`;

const Definition = styled.dd`
  margin: 0;
  color: ${colors.neutral.thin};
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
      <ColumnHeading first={true} onClick={() => ux.changeRowSortingOrder(0, 'name')}>
        <HeadingTop>
          Student Name
          <SortIcon sort={ux.sortForColumn(0, 'name')} />
        </HeadingTop>
        <HeadingMiddle>
          Lastname, Firstname <Icon type="exchange-alt" />
        </HeadingMiddle>
        <HeadingBottom>
          Available Points
        </HeadingBottom>
      </ColumnHeading>
      <ColumnHeading onClick={() => ux.changeRowSortingOrder(0, 'total')}>
        <HeadingTop>
          Total
          <SortIcon sort={ux.sortForColumn(0, 'total')} />
        </HeadingTop>
        <HeadingMiddle>
          <SplitCell>
            #
          </SplitCell>
          <SplitCell>
            %
          </SplitCell>
        </HeadingMiddle>
        <HeadingBottom>
          {20.0}
        </HeadingBottom>
      </ColumnHeading>
      <ColumnHeading>
        <HeadingTop>
          Late work
        </HeadingTop>
        <HeadingMiddle>
          Per day
        </HeadingMiddle>
        <HeadingBottom>
          {-10.0}
        </HeadingBottom>
      </ColumnHeading>
    </CellContents>
  </Cell>
));


const StudentCell = observer(({ student, striped }) => (
  <Cell striped={striped}>
    <CellContents>

      <Heading first={true}>
        <StyledButton variant="link">
          {student.name}
        </StyledButton>
      </Heading>

      <Total>
        {S.numberWithOneDecimalPlace(student.total_points)}
      </Total>
      <LateWork>
        {false && <CornerTriangle color="green" tooltip="Student was granted an extension" />}
        {student.late_work_penalty ? `-${S.numberWithOneDecimalPlace(student.late_work_penalty)}` : '0'}
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
        {false && <CornerTriangle color="blue" tooltip="Dropped" />}
        {S.numberWithOneDecimalPlace(heading.points)}
      </HeadingBottom>
    </ColumnHeading>
  </Cell>
));


const TaskResult = observer(({ result, striped }) => (
  <Cell striped={striped}>
    <Result isTrouble={false}>
      {result.is_completed ? S.numberWithOneDecimalPlace(result.points) : '…'}
    </Result>
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
      height: 100%;
    }
  }

  && {
    > *:not(:first-child), > .btn + .btn {
      margin-left: 1.6rem;
    }
    .btn:not(.btn-icon) {
      padding: 0.5rem 3.3rem 0.75rem;
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
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>Publish to make scores available to students</Tooltip>}
        >
          <AsyncButton
            variant="primary"
            isWaiting={ux.isPublishingScores}
            waitingText="Publishing…"
            onClick={ux.onPublishScores}
            data-test-id="publish-scores"
          >
            Publish scores
          </AsyncButton>
        </OverlayTrigger>
      </ControlGroup>
    </ControlsWrapper>
  );
});
TableHeader.propTypes = {
  ux: PropTypes.object.isRequired,
};

const Scores = observer(({ ux }) => {
  const { scores } = ux;

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
            <StudentCell student={student} striped={0 === sIndex % 2} />
            {student.questions.map((result, i) => (
              <TaskResult key={i} index={i} result={result} striped={0 === sIndex % 2} />
            ))}
          </Row>))}
      </StyledStickyTable>
      <DefinitionsWrapper>
        <Term variant="trouble" aria-label="Less than 50%"></Term>
        <Definition>Scores less than 50% of question's point value</Definition>
        <Term aria-label="Unattempted">&hellip;</Term>
        <Definition>Unattempted question of ungraded responses</Definition>
      </DefinitionsWrapper>
    </>
  );
});

Scores.title = 'Assignment Scores';

Scores.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Scores;