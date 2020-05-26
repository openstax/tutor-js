import { React, PropTypes, styled, observer, css } from 'vendor';
import { StickyTable, Row } from 'react-sticky-table';
import moment from 'moment';
import { isNil } from 'lodash';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { Icon } from 'shared';
import { colors } from 'theme';
import S from '../../helpers/string';
import SortIcon from '../../components/icons/sort';
import TutorLink from '../../components/link';
import TaskResultCell from './task-result-cell';
import AggregateResult from './aggregate-result-cell';
import MinMaxResult, { TYPE as MinMaxType } from './min-max-result-cell';
import { getCell } from './styles';
import AverageInfoModal from './average-info-modal';
import SetWeightsModal from './set-weights-modal';

const StyledStickyTable = styled(StickyTable)`
  margin: 2.2rem 0 1.4rem;

  .sticky-table-row:last-child .sticky-table-cell {
    border-bottom: 1px solid ${colors.neutral.pale};
  }
`;

const Cell = getCell('0');


const centeredCSS = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const headingCSS = css`
  height: 100%;
`;

const paddingCSS = css`
  padding: 1rem;
`;

const CellContents = styled.div`
  ${centeredCSS}
  > * { width: 80px; }
  > *:first-child {
    width: 23rem;
  }
  > *:last-child {
    width: 15rem;
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
  letter-spacing: 0.1rem;
  ${props => props.onClick && css`
    cursor: pointer;
  `}

  & .info-circle-icon-button {
    color: ${colors.bright_blue};
    display: block;
    margin-bottom: -2px;
  }

  & .heading-title {
    white-space: nowrap;
    width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const HeadingMiddle = styled.div`
  ${paddingCSS}
  align-self: stretch;
  padding-top: 0;
  font-size: 1rem;
  color: ${colors.neutral.thin};
  border-bottom: 1px solid ${colors.neutral.pale};

  & .set-weight-span {
    cursor: pointer;
    color: ${colors.link};
  }

  & .invert-name-icon-button {
    color: ${colors.link};
    font-size: 14px;
    display: inline-flex;
  }
`;

const HeadingBottom = styled.div`
  padding: 0.5rem 1rem;
  align-self: stretch;
  font-size: 1.2rem;
  background: #fff;
  position: relative;
  color: ${colors.neutral.thin};
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
    border-right: 1px solid ${colors.neutral.pale};
  }
  > * {
    ${props => !props.first && css`
      ${centeredCSS}
    `}
  }
  border-bottom: 1rem solid ${colors.neutral.pale};
`;

const SplitCell = styled.div`
  ${centeredCSS}
  flex: 1.0;
  ${props => props.border && css`
    border-right: 1px solid ${colors.neutral.pale};
  `}
  ${props => props.onClick && css`
      cursor: pointer;
    `}
`;

const Average = styled.div`
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

const FirstRowCell = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  padding-left: 15px;
`;

const DroppedNote = styled.div`
  font-size: 1.5rem;
  font-style: italic;
  font-family: serif;
`;

// Overriding the default 1px
const StyledStudentCell = styled(Cell)`
    ${props => props.drawBorderBottom && css`
    border-bottom: 2px solid ${colors.neutral.pale};
  `}
`;

const StudentColumnHeader = observer(({ ux }) => {

  return (
    <Cell>
      <CellContents>
        <ColumnHeading
          first={true}
          data-test-id="student-name-heading"
        >
          <HeadingTop
            onClick={() => ux.changeRowSortingOrder(ux.isNameInverted ? 'last_name' : 'first_name', 'score')}
          >          
            Student Name
            <SortIcon className="sort-name" sort={ux.sortForColumn(ux.isNameInverted ? 'last_name' : 'first_name', 'score')} />
          </HeadingTop>
          <HeadingMiddle>
            {ux.isNameInverted ? 'Lastname, Firstname' : 'Firstname, Lastname'}
            <Icon type="exchange-alt"
              className="invert-name-icon-button"
              onClick={() => ux.isNameInverted = !ux.isNameInverted} 
            />
          </HeadingMiddle>
          <HeadingBottom>
            Available Points
          </HeadingBottom>
        </ColumnHeading>
        <ColumnHeading>
          <HeadingTop
            onClick={() => ux.changeRowSortingOrder('course_average', 'score')}>
            Total
            <SortIcon
              sort={ux.sortForColumn('course_average', 'score')}
            />
          </HeadingTop>
          <HeadingMiddle>
            <span className="set-weight-span" onClick={() => ux.weights.showWeights()}>Set Weight</span>
          </HeadingMiddle>
          <HeadingBottom>
            {ux.weights.total}%
          </HeadingBottom>
        </ColumnHeading>
        <ColumnHeading>
          <HeadingTop>
            Averages <Icon
              type="info-circle"
              className="info-circle-icon-button"
              onClick={() => ux.showAverageInfo()}
            />
          </HeadingTop>
          <HeadingMiddle>
            <SplitCell
              border
              onClick={() => ux.changeRowSortingOrder('homework_score', 'score')}
            >
              Homework
              <SortIcon
                sort={ux.sortForColumn('homework_score', 'score')}
              />
            </SplitCell>
            <SplitCell
              onClick={() => ux.changeRowSortingOrder('reading_score', 'score')}
            >
              Reading
              <SortIcon
                sort={ux.sortForColumn('reading_score', 'score')}
              />
            </SplitCell>
          </HeadingMiddle>
          <HeadingBottom>
            <SplitCell border>
              {`${ux.weights.ux_homework_weight}%`}
            </SplitCell>
            <SplitCell>
              {`${ux.weights.ux_reading_weight}%`}
            </SplitCell>
          </HeadingBottom>
        </ColumnHeading>
      </CellContents>
    </Cell>
  );
});

const AssignmentHeading = observer(({ ux, heading, sortKey }) => {
  const onClick = () => ux.changeRowSortingOrder(sortKey, 'score');
  return (
    // Overlay has a lot of problems when showing at the top. Putting at the bottom for now
    <OverlayTrigger
      placement="bottom"
      trigger="hover"
      overlay={
        <Popover className="gradebook-popover">
          <p>{heading.title}</p>
        </Popover>}
    >
      <Cell>
        <ColumnHeading variant={heading.type}>
          <HeadingTop onClick={onClick}>     
            <div className="heading-title">{heading.title}</div>
            <SortIcon sort={ux.sortForColumn(sortKey, 'score')} />
          </HeadingTop>
          <HeadingMiddle>
            {moment(heading.due_at).format('MMM D')}
          </HeadingMiddle>
          <HeadingBottom>
            {false && <CornerTriangle color="blue" tooltip="Dropped" />}
            {S.numberWithOneDecimalPlace(heading.available_points)}
          </HeadingBottom>
        </ColumnHeading>
      </Cell>
    </OverlayTrigger>
   
  );
});

const percentOrDash = (score) => isNil(score) ? '--' : S.asPercent(score) + '%';

const StudentCell = observer(({ ux, student, striped, isLast }) => {
  return (
    <StyledStudentCell striped={striped} drawBorderBottom={isLast}>
      <CellContents>
        <Heading first={true}>
          <FirstRowCell data-cell="student-name">
            {
              !student.is_dropped
                ? <TutorLink
                  to="viewPerformanceGuide"
                  className="name-cell"
                  params={{ roleId: student.role, courseId: ux.course.id }}
                >
                  {ux.displayStudentName(student)}
                </TutorLink>   
                : <>{ux.displayStudentName(student)} <label><i>(dropped)</i></label></> 
            }
          </FirstRowCell>    
        </Heading>
        <Total>
          {percentOrDash(student.course_average)}
        </Total>
        <Average>
          <SplitCell border>
            {percentOrDash(student.homework_score)}
          </SplitCell>
          <SplitCell>
            {percentOrDash(student.reading_score)}
          </SplitCell>
        </Average>
      </CellContents>
    </StyledStudentCell>
  );
});

const GradebookTable = observer(({ ux }) => {
  return (
    <>
      <StyledStickyTable>
        {/* Headings */}
        <Row>
          <StudentColumnHeader ux={ux} />
          {ux.headings.map((h,i) => <AssignmentHeading key={i} sortKey={i} ux={ux} heading={h} />)}
        </Row>
        {/* Student info and data */}
        {ux.students.map((student,sIndex) => (
          <Row key={sIndex}>
            <StudentCell ux={ux} student={student} striped={sIndex % 2 === 0} isLast={sIndex === ux.students.length - 1} />
            {/* Correlation on student data and assignment header happens in the BE */}
            {ux.studentTasks(student).map((task, taskIndex) =>
              <TaskResultCell
                key={taskIndex}
                ux={ux}
                task={task} 
                striped={sIndex % 2 === 0}
                isLast={sIndex === ux.students.length - 1} 
              />)}
          </Row>))}
        {/* Do not show aggregates when instructor is searching for a student */}
        {
          !ux.searchingMatcher &&
          <>
            <Row>
              <Cell striped drawBorderBottom>
                <CellContents>
                  <Heading first={true}>
                    <FirstRowCell>Class Average</FirstRowCell>
                  </Heading>
                  <Total>
                    {ux.periodAverages.overall_course_average}
                  </Total>
                  <Average>
                    <SplitCell border>
                      {ux.periodAverages.overall_homework_score}
                    </SplitCell>
                    <SplitCell>
                      {ux.periodAverages.overall_reading_score}
                    </SplitCell>
                  </Average>
                </CellContents>
              </Cell>
              {ux.headings.map((h, i) => (<AggregateResult key={i} data={h} ux={ux} drawBorderBottom/>))}
            </Row>
            <Row>
              <Cell striped drawBorderBottom>
                <CellContents>
                  <Heading first={true}>
                    <FirstRowCell>Minimum Score</FirstRowCell>
                  </Heading>
                  <Total>
                    {ux.minScore('course_average')}
                  </Total>
                  <Average>
                    <SplitCell border>
                      {ux.minScore('homework_score')}
                    </SplitCell>
                    <SplitCell>
                      {ux.minScore('reading_score')}
                    </SplitCell>
                  </Average>
                </CellContents>
              </Cell>
              {ux.headings.map((h, i) => (<MinMaxResult key={i} key={i} data={h} ux={ux} type={MinMaxType.MAX} drawBorderBottom/>))}
            </Row>
            <Row>
              <Cell striped>
                <CellContents>
                  <Heading first={true}>
                    <FirstRowCell>Maximum Score</FirstRowCell>
                  </Heading>
                  <Total>
                    {ux.maxScore('course_average')}
                  </Total>
                  <Average>
                    <SplitCell border>
                      {ux.maxScore('homework_score')}
                    </SplitCell>
                    <SplitCell>
                      {ux.maxScore('reading_score')}
                    </SplitCell>
                  </Average>
                </CellContents>
              </Cell>
              {ux.headings.map((h, i) => (<MinMaxResult key={i} data={h} ux={ux} type={MinMaxType.MIN} />))}
            </Row>
          </>
        }
      </StyledStickyTable>
      {ux.hasDroppedStudents && <DroppedNote>* Dropped students' scores are not included in the overall course averages</DroppedNote>}
      <AverageInfoModal ux={ux} />
      <SetWeightsModal ux={ux} />
    </>
  );
});
GradebookTable.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default GradebookTable;