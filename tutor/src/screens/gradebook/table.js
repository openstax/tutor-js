import { React, PropTypes, styled, useObserver, css } from 'vendor';
import { StickyTable, Row, Cell as TableCell } from 'react-sticky-table';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import { Icon } from 'shared';
import { colors } from 'theme';
import S from '../../helpers/string';
import TaskResultCell from './task-result-cell';

const StyledStickyTable = styled(StickyTable)`
  margin: 2.2rem 0 1.4rem;

  .sticky-table-row:last-child .sticky-table-cell {
    border-bottom: 2px solid ${colors.neutral.pale};
  }
`;

const Cell = styled(TableCell)`
  padding: 0;
  border-bottom: 0;
  border-left: 2px solid ${colors.neutral.pale};
  &:last-child {
    border-right: 2px solid ${colors.neutral.pale};
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
  > *:first-child, > *:last-child {
    width: 16rem;
  }
`;

const Heading = styled.div`
  ${props => !props.first && centeredCSS}
  ${props => props.first && css`
    border-right: 2px solid ${colors.neutral.pale};
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
  background: ${props =>
    !props.variant 
      ? colors.neutral.lighter
      : props.variant === 'homework'
        ? colors.templates.homework.background
        : colors.templates.reading.background};
  border-top: 0.4rem solid ${props =>
    !props.variant 
      ? colors.neutral.std
      : props.variant === 'homework'
        ? colors.templates.homework.border
        : colors.templates.reading.border};
  &:not(:last-child) {
    border-right: 2px solid ${colors.neutral.pale};
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
  border-right: 2px solid  ${colors.neutral.pale};
  ${centeredCSS}
`;

const StyledButton = styled(Button)`
  && { padding: 0; }
`;

const StudentColumnHeader = () => {
  return useObserver(() => (
    <Cell leftBorder={true}>
      <CellContents>
        <ColumnHeading first={true}>
          <HeadingTop>
            Student Name
          </HeadingTop>
          <HeadingMiddle>
            Lastname, Firstname <Icon type="exchange-alt" />
          </HeadingMiddle>
          <HeadingBottom>
            Available Points
          </HeadingBottom>
        </ColumnHeading>
        <ColumnHeading>
          <HeadingTop>
            Total <Icon type="sort" />
          </HeadingTop>
          <HeadingMiddle>
            Set Weight
          </HeadingMiddle>
          <HeadingBottom>
            100%
          </HeadingBottom>
        </ColumnHeading>
        <ColumnHeading>
          <HeadingTop>
            Averages
          </HeadingTop>
          <HeadingMiddle>
            <SplitCell>
              homework
            </SplitCell>
            <SplitCell>
              reading
            </SplitCell>
          </HeadingMiddle>
          <HeadingBottom>
            <SplitCell>
              100%
            </SplitCell>
            <SplitCell>
              100%
            </SplitCell>
          </HeadingBottom>
        </ColumnHeading>
      </CellContents>
    </Cell>
  ));
};

const StudentCell = ({ student, striped }) => {
  return useObserver(() => (
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
};

const AssignmentHeading = ({ ux, heading, sortKey }) => {
  const onClick = () => ux.changeRowSortingOrder(sortKey, 'score');
  console.log(heading);
  return useObserver(() => (
    <Cell onClick={onClick}>
      <ColumnHeading variant={heading.type}>
        <HeadingTop>
          {heading.title}
        </HeadingTop>
        <HeadingMiddle>
          {moment(heading.due_at).format('MMM D')}
        </HeadingMiddle>
        <HeadingBottom>
          {false && <CornerTriangle color="blue" tooltip="Dropped" />}
          {S.numberWithOneDecimalPlace(heading.points)}
        </HeadingBottom>
      </ColumnHeading>
    </Cell>
  ));
};


const GradebookTable = ({ ux }) => {

  return useObserver(() => (
    <StyledStickyTable>
      <Row>
        <StudentColumnHeader />
        {ux.headings.map((h,i) => <AssignmentHeading key={i} sortKey={i} ux={ux} heading={h} />)}
      </Row>
      {ux.students.map((student,i) => (
        <Row key={i}>
          <StudentCell ux={ux} student={student} />
          {ux.studentTasks(student).map((task, i) => <TaskResultCell key={i} ux={ux} task={task} />)}
        </Row>))}
    </StyledStickyTable>
  ));
};

GradebookTable.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default GradebookTable;
