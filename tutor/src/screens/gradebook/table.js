import { React, PropTypes, styled, useObserver, observer, css } from 'vendor';
import { StickyTable, Row } from 'react-sticky-table';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import { Icon } from 'shared';
import { colors } from 'theme';
import S from '../../helpers/string';
import SortIcon from '../../components/icons/sort';
import TaskResultCell from './task-result-cell';
import AggregateResult from './aggregate-result-cell';
import MinMaxResult, { TYPE as MinMaxType } from './min-max-result-cell';
import { getCell } from './styles';
import AverageInfoModal from './average-info-modal';
import SetWeightsModal from './set-weights-modal';

const StyledStickyTable = styled(StickyTable)`
  margin: 2.2rem 0 1.4rem;

  .sticky-table-row:last-child .sticky-table-cell {
    border-bottom: 2px solid ${colors.neutral.pale};
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
  > *:first-child, > *:last-child {
    width: 20rem;
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

  & .info-circle-icon-button {
    color: ${colors.bright_blue};
    display: block;
    margin-bottom: -2px;
  }
`;

const HeadingMiddle = styled.div`
  ${paddingCSS}
  align-self: stretch;
  padding-top: 0;
  font-size: 1rem;
  color: ${colors.neutral.thin};
  border-bottom: 2px solid ${colors.neutral.pale};

  & .set-weight-span {
    cursor: pointer;
    color: ${colors.bright_blue};
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
    border-right: 2px solid ${colors.neutral.pale};
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
    border-right: 2px solid ${colors.neutral.pale};
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
  border-right: 2px solid  ${colors.neutral.pale};
  ${centeredCSS}
`;

const StyledButton = styled(Button)`
  && { padding: 0; }
`;

const StudentColumnHeader = ({ ux }) => {
  return useObserver(() => (
    <Cell>
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
            <span className="set-weight-span" onClick={() => ux.weights.showWeights()}>Set Weight</span>
          </HeadingMiddle>
          <HeadingBottom>
            100%
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
            <SplitCell border>
              homework <Icon type="sort" />
            </SplitCell>
            <SplitCell>
              reading <Icon type="sort" />
            </SplitCell>
          </HeadingMiddle>
          <HeadingBottom>
            <SplitCell border>
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


const AssignmentHeading = observer(({ ux, heading, sortKey }) => {
  const onClick = () => ux.changeRowSortingOrder(sortKey, 'score');
  return (
    <Cell onClick={onClick}>
      <ColumnHeading variant={heading.type}>
        <HeadingTop>
          {heading.title}
          <SortIcon sort={ux.sortForColumn(sortKey, 'score')} />
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
  );
});

const StudentCell = ({ student, striped, isLast }) => {
  return useObserver(() => (
    <Cell striped={striped} drawBorderBottom={isLast}>
      <CellContents>

        <Heading first={true}>
          <StyledButton variant="link">
            {student.name}
          </StyledButton>
        </Heading>

        <Total>
          {`${S.asPercent(student.course_average)}%`}
        </Total>
        <Average>
          <SplitCell border>
            {`${S.asPercent(student.homework_score)}%`}
          </SplitCell>
          <SplitCell>
            {`${S.asPercent(student.reading_score)}%`}
          </SplitCell>
        </Average>
      </CellContents>
    </Cell>
  ));
};

const GradebookTable = ({ ux }) => {
  const periodAverages = ux.periodAverages;
  return useObserver(() => (
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
        {/* Class Average */}
        <Row>
          <Cell striped drawBorderBottom>
            <CellContents>
              <Heading first={true}>
              Class Average
              </Heading>
              <Total>
                {periodAverages.overall_course_average}
              </Total>
              <Average>
                <SplitCell border>
                  {periodAverages.overall_homework_score}
                </SplitCell>
                <SplitCell>
                  {periodAverages.overall_reading_score}
                </SplitCell>
              </Average></CellContents>
          </Cell>
          {ux.headings.map((h, i) => (<AggregateResult key={i} data={h} ux={ux} drawBorderBottom/>))}
        </Row>
        {/* Maximum score */}
        <Row>
          <Cell striped drawBorderBottom>
            <CellContents>
              <Heading first={true}>
              Maximum Score
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
              </Average></CellContents>
          </Cell>
          {ux.headings.map((h, i) => (<MinMaxResult key={i} key={i} data={h} ux={ux} type={MinMaxType.MAX} drawBorderBottom/>))}
        </Row>
        {/* Minimum score */}
        <Row>
          <Cell striped>
            <CellContents>
              <Heading first={true}>
              Minimum Score
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
              </Average></CellContents>
          </Cell>
          {ux.headings.map((h, i) => (<MinMaxResult key={i} data={h} ux={ux} type={MinMaxType.MIN} />))}
        </Row>
      </StyledStickyTable>
      <AverageInfoModal ux={ux} />
      <SetWeightsModal ux={ux} />

    </>
  ));
};
GradebookTable.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default GradebookTable;
