import { React, PropTypes, styled, observer, moment } from 'vendor';
import { OverlayTrigger, Popover, Table } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { isNil } from 'lodash';
import { colors, breakpoint } from 'theme';
import { Icon } from 'shared';
import ScoresHelper, { UNWORKED } from '../../helpers/scores';
import SortIcon from '../../components/icons/sort';
import { EIcon } from '../../components/icons/extension';
import Responsive from '../../components/responsive';

const TableWrapper = styled.div`
  background-color: white;

  ${breakpoint.desktop`
    padding: 40px 10rem;
  `}

  .info-circle-icon-button {
    color: ${colors.link};
    margin-left: 10px;
  }

  .average-score {
    margin-top: 10px;

    > :first-child {
      margin-right: 20px;
    }
  }
`;

const Header = styled.div`
  padding: 16px;

  .average-score > * + * {
    margin-top: 8px;
  }

  h3 {
    letter-spacing: -0.096rem;
    display: flex;
    align-items: center;
  }

  ${breakpoint.desktop`
    padding: 0;

    .average-score > * {
      display: inline;
    }
  `}
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;

  margin-top: 16px;
  padding: 0 16px 16px;

  ${breakpoint.desktop`
    padding: 0;
  `}

  > * {
    display: flex;
    margin-bottom: 8px;
  }
  span label {
    font-size: 12px;
  }
  .extension {
    label {
      margin-left: 8px;
    }
  }
  .ox-icon {
    margin-left: 0;
  }
  span:not(:last-child) {
    margin-right: 16px;
  }
`;

const AssignmentBlock = styled.div`
  border: 4px solid ${props => props.assignmentColor};
  display: inline-block;
  width: 1.5rem;
  margin-right: 5px;
`;

const StyledTable = styled(Table)`

  ${breakpoint.desktop`
    margin-top: 20px;
  `}

  thead {
    display: none;
    background: ${colors.neutral.lighter};
    border-bottom: 1px solid ${colors.neutral.pale};

    ${breakpoint.desktop`
      display: table-header-group;
    `}

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
    ${breakpoint.desktop`
      height: 40px;
    `}
    th, td {
      vertical-align: middle;
      word-break: break-all;
      ${breakpoint.desktop`
        word-break: normal;
      `}
    }
    td:first-child {
      padding-left: 10px;
      cursor: pointer;
      color: ${colors.link};
      font-weight: 600;
      border-left: 4px solid transparent;

      ${breakpoint.desktop`
        border-left-width: 8px;
      `}

      &.border-reading {
        border-left-color: ${colors.templates.reading.border};
      }
      &.border-homework {
        border-left-color: ${colors.templates.homework.border};
      }
      &.border-external {
        border-left-color: ${colors.templates.external.border};
      }
      &.border-event {
        border-left-color: ${colors.templates.event.border};
      }
    }

    .extension-icon {
      margin-left: 4px;
    }

    .icon-wrapper {
      display: flex;
      align-items: center;
    }

  }

  /** Striped colors */
  tbody tr:nth-of-type(odd) {
    background-color: ${colors.bright};
  }

  .mobile-title {
    line-height: 2.4rem;
    margin-bottom: 3px;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  line-height: 2.4rem;
  font-weight: normal;
  color: ${colors.neutral.darker};

  > :first-child {
    width: 96px;
    color: ${colors.neutral.lite};
    font-size: 1.2rem;
    line-height: 1.2rem;
  }
`;

const StyledPopover = styled(Popover)`
  pointer-events: none;
`;

const percentOrDash = (score) => isNil(score) ? UNWORKED : `${ScoresHelper.asPercent(score)}%`;
const hasExtension = (studentTaskPlans, studentTaskPlanId) => {
  const studentTaskPlan = studentTaskPlans.array.find(s => parseInt(s.id, 10) === studentTaskPlanId);
  return studentTaskPlan ? studentTaskPlan.is_extended : false;
};

const DueInfo = ({ sd, course }) => (
  <div className="icon-wrapper">
    {moment(sd.due_at).format('MMM D')}
    {hasExtension(course.studentTaskPlans, sd.id) && <EIcon inline />}
  </div>
);

const PointsInfo = ({ sd }) => (
  <div className="icon-wrapper">
    {sd.humanPoints}
    {sd.isLate && <Icon color={colors.danger} type="clock" />}
  </div>
);

const PercentageInfo = ({ sd  }) => (
  <div className="icon-wrapper">
    <strong>{sd.humanScore}</strong>
    {sd.is_provisional_score && <Icon variant="circledStar" />}
  </div>
);

const MobileStudentDataRow = ({ sd, history, ux: { course, goToAssignment } }) => (
  <tr>
    <td
      className={`border-${sd.reportHeading.type}`}
      onClick={() => goToAssignment(history, course.id, sd.id)}>
      <div className="mobile-title">
        {sd.reportHeading.title}
      </div>
      <InfoItem>
        <div>Due date</div>
        <DueInfo sd={sd} course={course} />
      </InfoItem>
      <InfoItem>
        <div>Points scored</div>
        <PointsInfo sd={sd} />
      </InfoItem>
      <InfoItem>
        <div>Percentage</div>
        <PercentageInfo sd={sd} />
      </InfoItem>
    </td>
  </tr>
);
MobileStudentDataRow.propTypes = {
  sd: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  ux: PropTypes.object.isRequired,
};

const DesktopStudentDataRow = ({ sd, history, ux: { course, goToAssignment } }) => (
  <tr>
    <td
      className={`border-${sd.reportHeading.type}`}
      onClick={() => goToAssignment(history, course.id, sd.id)}>
      {sd.reportHeading.title}
    </td>
    <td>
      <DueInfo sd={sd} course={course} />
    </td>
    <td>
      <PointsInfo sd={sd} />
    </td>
    <td>
      <PercentageInfo sd={sd} />
    </td>
  </tr>
);
DesktopStudentDataRow.propTypes = {
  sd: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  ux: PropTypes.object.isRequired,
};

const GradebookTable = observer((
  {
    history, ux,
    ux: { student, studentData, course, sort, displaySort, sortFieldConstants },
  }) => {
  return (
    <TableWrapper>
      <Header>
        <h3>
          <span>
            <strong>Course Average:</strong> {percentOrDash(student.course_average)}
          </span>
          <OverlayTrigger
            placement="right"
            trigger={['hover', 'click']}
            rootClose
            delay={{ show: 150, hide: 300 }}
            overlay={
              <StyledPopover className="scores-popover">
                <p>
                  <strong>Course Average = </strong><br/>
                  {ScoresHelper.asPercent(course.homework_weight)}% Homework average + {ScoresHelper.asPercent(course.reading_weight)}% Reading average
                </p>
              </StyledPopover>
            }
          >
            <Icon
              type="info-circle"
              className="info-circle-icon-button"
            />
          </OverlayTrigger>
        </h3>
        <div className="average-score">
          <div>
            <AssignmentBlock assignmentColor={colors.templates.homework.border}/>
            Homework Average: <strong>{percentOrDash(student.homework_score)}</strong>
          </div>
          <div>
            <AssignmentBlock assignmentColor={colors.templates.reading.border}/>
            Reading Average: <strong>{percentOrDash(student.reading_score)}</strong>
          </div>
        </div>
      </Header>
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
          {studentData.map((sd, i) => (
            <Responsive
              desktop={<DesktopStudentDataRow sd={sd} ux={ux} history={history} />}
              tablet={<MobileStudentDataRow sd={sd} ux={ux} history={history} />}
              mobile={<MobileStudentDataRow sd={sd} ux={ux} history={history} />}
              key={i}
            />
          ))}
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
