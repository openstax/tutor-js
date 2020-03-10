import { React, PropTypes, styled, useObserver, css } from 'vendor';
import { StickyTable, Row, Cell as TableCell } from 'react-sticky-table';
import { Icon } from 'shared';
import { colors } from 'theme';
import S from '../../helpers/string';
import ExerciseType from './exercise-type';

// https://projects.invisionapp.com/d/main#/console/18937568/401942280/preview

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
  flex-direction: column;
  border-right: 1px solid ${colors.neutral.lite};
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

const isTroubleCSS = css`
  background-color: ${colors.states.trouble}
  border-top: 1px solid ${colors.danger};
  border-bottom: 1px solid ${colors.danger};
`;

const Result = styled.div`
  border-right: 1px solid ${colors.neutral.lite};
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  ${props => props.isTrouble && isTroubleCSS}
`;

const StudentColumnHeader = () => {
  return useObserver(() => (
    <Cell>
      <CellContents>
        <Heading>
          <HeadingTop>
            Student Name
          </HeadingTop>
          <HeadingMiddle>
            Lastname, Firstname <Icon type="exchange-alt" />
          </HeadingMiddle>
          <HeadingBottom>
            Available Points
          </HeadingBottom>
        </Heading>
        <Heading>
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
        </Heading>
        <Heading>
          <HeadingTop>
            Late work
          </HeadingTop>
          <HeadingMiddle>
            Per day
          </HeadingMiddle>
          <HeadingBottom>
            {-10.0}
          </HeadingBottom>
        </Heading>
      </CellContents>
    </Cell>
  ));
};

const StudentCell = ({ student }) => {

  return useObserver(() => (
    <Cell>
      <CellContents>

        <Heading>
          <HeadingTop>
            {student.name}
          </HeadingTop>
          <HeadingBottom>
            {student.student_identifier}
          </HeadingBottom>
        </Heading>

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

const AssignmentHeading = ({ info, index }) => {
  return useObserver(() => (
    <Cell>
      <Heading>
        <HeadingTop>
          Q{index+1}
        </HeadingTop>
        <HeadingMiddle>
          <ExerciseType exercise={info.exercise} />
        </HeadingMiddle>
        <HeadingBottom>
          {S.numberWithOneDecimalPlace(info.points)}
        </HeadingBottom>
      </Heading>
    </Cell>
  ));
};

const TaskResult = ({ info, answer }) => {
  return useObserver(() => (
    <Cell>
      <Result isTrouble={false}>{answer ? S.numberWithOneDecimalPlace(info.points) : '…'}</Result>
    </Cell>
  ));
};

const Scores = ({ ux }) => {
  const { scores } = ux;

  return useObserver(() => (
    <StickyTable>
      <Row>
        <StudentColumnHeader scores={scores} />
        {scores.questionsInfo.map((info, i) => <AssignmentHeading key={info.key} index={i} info={info} />)}
      </Row>
      {scores.sortedStudents.map((student,i) => (
        <Row key={i}>
          <StudentCell student={student} />
          {scores.questionsInfo.map((info, i) => (
            <TaskResult key={info.key} index={i} info={info} answer={info.stats.answerForStudent(student)} />
          ))}
        </Row>))}
    </StickyTable>
  ));
};

Scores.title = 'Assignment Scores';

Scores.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Scores;
