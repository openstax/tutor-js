import { React, PropTypes, styled, observer, moment } from 'vendor';
import { OverlayTrigger, Popover, Table } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { isNil } from 'lodash';
import { colors } from 'theme';
import { Icon } from 'shared';
import S from '../../helpers/string';
import SortIcon from '../../components/icons/sort';
import { EIcon } from '../../components/icons/extension';

const TableWrapper = styled.div`
  background-color: white;
  padding: 40px 10rem;

  :first-child {
    .info-circle-icon-button {
    color: ${colors.link};
    margin-bottom: -2px;
    width: 1.5rem;
    margin-left: 10px;
  }

  .average-score {
    margin-top: 10px;
    width: 50%;
    
    span:first-child {
      margin-right: 20px;
    }
  }
}
`;

const Legend = styled.div`
  display: flex;
  margin-top: 10px;
  span label {
    font-size: 12px;
  }
  .extension {
    display: flex;
    label {
      margin-left: 8px;
    }
  }
  span:not(:first-child) {
    margin-left: 20px;
  }
`;

const AssignmentBlock = styled.div`
    border: 4px solid ${props => props.assignmentColor};
    display: inline-block;
    width: 1.5rem;
    margin-right: 5px;
`;

const StyledTable = styled(Table)`
  margin-top: 20px;

  thead {
    background: ${colors.neutral.lighter};
    border-bottom: 1px solid ${colors.neutral.pale}; 

    tr {
      th {
        cursor: pointer;
      }
      th:first-child {
        width: 30%;
        padding-left: 15px;
      }
    }
  }

  &&& tr {
    height: 40px;
    th, td {
      vertical-align: middle;
    }
    td:first-child {
      padding-left: 10px;
      cursor: pointer;
      color: ${colors.link};
      font-weight: 600;
    }
    .border-reading {
      border-left: 10px solid ${colors.templates.reading.border};
    }
    .border-homework {
      border-left: 10px solid ${colors.templates.homework.border};
    }
    .border-external {
      border-left: 10px solid ${colors.templates.external.border};
    }
    .border-event {
      border-left: 10px solid ${colors.templates.event.border};
    }
    
  }

  /** Striped colors */
  tbody tr:nth-of-type(odd) {
    background-color: ${colors.bright};
  }
`;

const percentOrDash = (score) => isNil(score) ? '--' : S.asPercent(score) + '%';
const hasExtension = (studentTaskPlans, studentTaskPlanId) => {
  const studentTaskPlan = studentTaskPlans.array.find(s => parseInt(s.id, 10) === studentTaskPlanId);
  return studentTaskPlan ? studentTaskPlan.is_extended : false;
};

const GradebookTable = observer((
  {
    history,
    ux: { student, studentData, course, goToAssignment, sort, displaySort, sortFieldConstants }, 
  }) => {
  return (
    <TableWrapper>
      <h3>
        <strong>Course Average:</strong> {percentOrDash(student.course_average)}
        <OverlayTrigger
          placement="right"
          delay={{ show: 150, hide: 300 }}
          overlay={
            <Popover className="scores-popover">
              <p><strong>Course Average = </strong><br/>
                {S.asPercent(course.homework_weight)}% Homework average + {S.asPercent(course.reading_weight)}% Reading average</p>
            </Popover>
          }
        >
          <Icon
            type="info-circle"
            className="info-circle-icon-button"
          />
        </OverlayTrigger>
      </h3>
      <div className="average-score">
        <span>
          <AssignmentBlock assignmentColor={colors.templates.homework.border}/>
          Homework Average: <strong>{percentOrDash(student.homework_score)}</strong>
        </span>
        <span>
          <AssignmentBlock assignmentColor={colors.templates.reading.border}/>
          Reading Average: <strong>{percentOrDash(student.reading_score)}</strong>
        </span>
      </div>
      <StyledTable striped borderless hover responsive>
        <thead>
          <tr>
            <th onClick={() => sort(sortFieldConstants.title)}>
              Assignment Name
              <SortIcon sort={displaySort(sortFieldConstants.title)}/>
            </th>
            <th onClick={() => sort(sortFieldConstants.dueAt)}>
              Due date
              <SortIcon sort={displaySort(sortFieldConstants.dueAt)}/>
            </th>
            <th onClick={() => sort(sortFieldConstants.points)}>
              Points scored
              <SortIcon sort={displaySort(sortFieldConstants.points)}/>
            </th>
            <th onClick={() => sort(sortFieldConstants.score)}>
              Percentage
              <SortIcon sort={displaySort(sortFieldConstants.score)}/>
            </th>
          </tr>
        </thead>
        <tbody>
          {studentData.map((sd,i) => {
            return (<tr key={i}>
              <td
                className={`border-${sd.reportHeading.type}`}
                onClick={() => goToAssignment(history, course.id, sd.id)}>
                {sd.reportHeading.title}
              </td>
              <td>{moment(sd.due_at).format('MMM D')} {hasExtension(course.studentTaskPlans, sd.id) && <EIcon inline />} </td>
              {/** TODO: Add provisional score logic */}
              <td>{sd.humanScoreNumber} {sd.isLate && <Icon color={colors.danger} type="clock" />}</td>
              <td>{percentOrDash(sd.score)}</td>
            </tr>);
          })}
        </tbody>
      </StyledTable>
      <Legend>
        <span className="extension">
          <EIcon/>
          <label>Extension</label>
        </span>
        <span>
          <Icon color={colors.danger} type="clock" />
          <label>Late penalty</label>
        </span>
        <span>
          <Icon variant="circledStar" />
          <label>Provisional score. FInal scores will be available when published by your instructor.</label>
        </span>
      </Legend>
    </TableWrapper>
  );
});
GradebookTable.propTypes = {
  ux: PropTypes.object.isRequired,
};
export default withRouter(GradebookTable);
