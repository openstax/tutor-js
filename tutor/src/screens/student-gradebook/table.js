import { React, PropTypes, styled, observer, moment } from 'vendor';
import S from '../../helpers/string';
import { colors } from 'theme';
import { isNil } from 'lodash';
import { StickyTable, Row, Cell } from 'react-sticky-table';

const TableWrapper = styled.div`
  background-color: white;
  padding: 1rem 4rem;
`;

const StyledStickyTable = styled(StickyTable)`
  margin: 2.2rem 0 1.4rem;

  .sticky-table-row:last-child .sticky-table-cell {
    border-bottom: 1px solid ${colors.neutral.pale};
  }
`;

const percentOrDash = (score) => isNil(score) ? '--' : S.asPercent(score) + '%';

const GradebookTable = observer(({ ux: { student, headings } }) => {
  
  return (
    <TableWrapper>
      <h3>Course Average: {percentOrDash(student.course_average)}</h3>
      <div>
        <span>Homework Average: {percentOrDash(student.homework_score)}</span>
        <span>Reading Average: {percentOrDash(student.reading_score)}</span>
      </div>
      <StyledStickyTable>
        <Row>
          <Cell>Assignment Name</Cell>
          <Cell>Due date</Cell>
          <Cell>Points scored</Cell>
          <Cell>Percentage</Cell>
        </Row>
        {headings.map((h,i) => (
          <Row key={i}>
            <Cell>{h.title}</Cell>
            <Cell>{moment(h.due_at).format('MMM D')}</Cell>
            <Cell>{student.data[i].humanScoreNumber}</Cell>
            <Cell>{percentOrDash(student.data[i].score)}</Cell>
          </Row>))}
      </StyledStickyTable>
    </TableWrapper>
  );
});
GradebookTable.propTypes = {
  ux: PropTypes.object.isRequired,
};
export default GradebookTable;
