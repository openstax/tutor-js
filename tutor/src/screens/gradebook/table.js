import { React, PropTypes, styled, useObserver, css } from 'vendor';
import { StickyTable, Row, Cell as TableCell } from 'react-sticky-table';
import { Icon } from 'shared';
import { colors } from 'theme';
import S from '../../helpers/string';
import TaskResultCell from './task-result-cell';
import SortingIcon from './sorting-icon';

// https://projects.invisionapp.com/d/main#/console/18937568/402445519/preview

const Cell = styled(TableCell)`
  padding: 0;
  height: 4.5rem;
`;

const centeredCSS = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CellContents = styled.div`
  ${centeredCSS}
  height: 100%;
  > * { width: 80px; }
  > *:first-child { width: 200px; }
`;

const Heading = styled.div`
  height: 100%;
  padding: 0.5rem;
  ${centeredCSS}
  border-right: 1px solid ${colors.neutral.lite};
`;

const HeadingLabel = styled.div`
  ${centeredCSS}
  flex-direction: column;
`;

const HeadingTop = styled.div`
  ${centeredCSS}
  font-weight: bold;
`;

const HeadingMiddle = styled.div`
  ${centeredCSS}
`;

const HeadingBottom = styled.div`
  ${centeredCSS}
  font-weight: 100;
  font-size: 80%;
`;

const SplitCell = styled.div`
  ${centeredCSS}
  flex: 1.0;
`;

const LateWork = styled.div`
  padding: 0;
  height: 100%;
  ${centeredCSS}
  border-right: 1px solid ${colors.neutral.lite};
`;

const Total = styled.div`
  padding: 0;
  height: 100%;
  ${centeredCSS}
  border-right: 1px solid ${colors.neutral.lite};
`;

const StudentColumnHeader = () => {
  return useObserver(() => (
    <Cell>
      <CellContents>
        <HeadingLabel>
          <HeadingTop>
            Student Name
          </HeadingTop>
          <HeadingMiddle>
            Lastname, Firstname <Icon type="exchange-alt" />
          </HeadingMiddle>
          <HeadingBottom>
            Available Points
          </HeadingBottom>
        </HeadingLabel>
        <HeadingLabel>
          <HeadingTop>
            Total <Icon type="sort" />
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
        </HeadingLabel>
        <HeadingLabel>
          <HeadingTop>
            Late work
          </HeadingTop>
          <HeadingMiddle>
            Per day
          </HeadingMiddle>
          <HeadingBottom>
            {-10.0}
          </HeadingBottom>
        </HeadingLabel>
      </CellContents>
    </Cell>
  ));
};

const StudentCell = ({ student }) => {

  return useObserver(() => (
    <Cell>
      <CellContents>

        <HeadingLabel>
          <HeadingTop>
            {student.name}
          </HeadingTop>
          <HeadingBottom>
            {student.student_identifier}
          </HeadingBottom>
        </HeadingLabel>

        <Total>
          {S.numberWithOneDecimalPlace(student.course_average)}
        </Total>

        <LateWork>
          ??
        </LateWork>
      </CellContents>
    </Cell>
  ));
};

const AssignmentHeading = ({ ux, heading, sortKey }) => useObserver(() => {

  const onClick = () => ux.changeRowSortingOrder(sortKey, 'score');

  return (
    <Cell onClick={onClick}>
      <Heading>
        <HeadingLabel>
          <HeadingTop>
            {heading.title}
          </HeadingTop>
          <HeadingMiddle>
            MPQ/SPQ/WRM
          </HeadingMiddle>
          <HeadingBottom>
            {S.numberWithOneDecimalPlace(heading.average_score)}
          </HeadingBottom>
        </HeadingLabel>
        <SortingIcon ux={ux} heading={heading} dataType="score" sortKey={sortKey} />
      </Heading>
    </Cell>
  );
});


const GradebookTable = ({ ux }) => {

  return useObserver(() => (
    <StickyTable>
      <Row>
        <StudentColumnHeader />
        {ux.headings.map((h,i) => <AssignmentHeading key={i} sortKey={i} ux={ux} heading={h} />)}
      </Row>
      {ux.students.map((student,i) => (
        <Row key={i}>
          <StudentCell ux={ux} student={student} />
          {ux.studentTasks(student).map((score, i) => <TaskResultCell key={i} ux={ux} task={score} />)}
        </Row>))}
    </StickyTable>
  ));
};

GradebookTable.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default GradebookTable;
