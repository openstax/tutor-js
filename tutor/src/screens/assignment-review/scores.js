import { React, PropTypes, styled, useObserver, css } from 'vendor';
import { StickyTable, Row, Cell as TableCell } from 'react-sticky-table';
import { Button } from 'react-bootstrap';
import { Icon } from 'shared';
import { colors } from 'theme';
import S from '../../helpers/string';
import ExerciseType from './exercise-type';

// https://projects.invisionapp.com/d/main#/console/18937568/401942280/preview

const StyledStickyTable = styled(StickyTable)`
  margin: 2.2rem 0 1.4rem;
`;

const Cell = styled(TableCell)`
  padding: 0;
  border-left: 1px solid ${colors.neutral.pale};
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
  flex-direction: column;
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
`;

const ColumnHeading = styled.div`
  ${headingCSS}
  background: ${props => props.variant === 'q' ? colors.templates.homework.background : colors.neutral.lighter};
  border-top: 0.4rem solid ${props => props.variant === 'q' ? colors.templates.homework.border : colors.neutral.std};
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
  height: 100%;
  ${centeredCSS}
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
  height: 100%;
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
      <ColumnHeading variant="q">
        <HeadingTop>
          Q{index+1}
        </HeadingTop>
        <HeadingMiddle>
          <ExerciseType exercise={info.exercise} />
        </HeadingMiddle>
        <HeadingBottom>
          {S.numberWithOneDecimalPlace(info.points)}
        </HeadingBottom>
      </ColumnHeading>
    </Cell>
  ));
};

const TaskResult = ({ info, answer, striped }) => {
  return useObserver(() => (
    <Cell striped={striped}>
      <Result isTrouble={false}>{answer ? S.numberWithOneDecimalPlace(info.points) : '…'}</Result>
    </Cell>
  ));
};

const Scores = ({ ux }) => {
  const { scores } = ux;

  return useObserver(() => (
    <>
      <StyledStickyTable>
        <Row>
          <StudentColumnHeader scores={scores} />
          {scores.questionsInfo.map((info, i) => <AssignmentHeading key={info.key} index={i} info={info} />)}
        </Row>
        {scores.sortedStudents.map((student,sIndex) => (
          <Row key={sIndex}>
            <StudentCell student={student} striped={0 === sIndex % 2} />
            {scores.questionsInfo.map((info, i) => (
              <TaskResult key={info.key} index={i} info={info} answer={info.stats.answerForStudent(student)} striped={0 === sIndex % 2} />
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
  ));
};

Scores.title = 'Assignment Scores';

Scores.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Scores;
