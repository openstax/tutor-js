import { React, PropTypes, useObserver, useRef, styled } from 'vendor';
import { Button } from 'react-bootstrap';
import { colors } from 'theme';

const Name=styled.div`
  font-weight: bold;
`;
const StudentName = ({ student }) => <Name>{student.last_name}, {student.first_name}</Name>;
StudentName.propTypes = {
  student: PropTypes.object.isRequired,
};

const Box = styled.div`
 min-height: 7rem;
 padding: 2rem;
 display: flex;
 justify-content: space-between;
 border: 1px solid ${colors.neutral.lite};
 & + & {
   margin-top: 1rem;
 }
`;

const GradingStudentWrapper=styled(Box)`
  box-shadow: 0 0 1.5rem 0 rgba(0,0,0,0.75);
  margin-bottom: 1rem;
`;

const Panel=styled.div`
  display: flex;
  flex-direction: column;
  ${Name} {
    margin-bottom: 2rem;
  }
`;

const GradingStudent = ({ student, ux, question }) => useObserver(() => {
  const commentsRef = useRef();
  const scoreRef = useRef();
  return (
    <GradingStudentWrapper data-student-id={student.id} data-test-id="student-answer">
      <Panel>
        <StudentName student={student} />
        <p>{question.free_response}</p>
      </Panel>
      <Panel>
        <Score question={question} ref={scoreRef} />
        <b>Comment:</b>
        <textarea name="comment" ref={commentsRef} />
        <Button onClick={() => ux.saveScore({
          student, question, points: scoreRef.current.value, comment: commentsRef.current.value,
        })}>Save</Button>
      </Panel>
    </GradingStudentWrapper>
  );
});


const ScoreWrapper = styled.div`
  display: flex;
`;
const Score = React.forwardRef(({ question }, ref) => useObserver(() => {
  return (
    <ScoreWrapper>
      <b>Score:</b> <input name="score" ref={ref} defaultValue={question.points} /> out of {question.availablePoints}
    </ScoreWrapper>
  );
}));
Score.propTypes = {
  question: PropTypes.object.isRequired,
};

const CollapsedStudent = (props) => useObserver(() => {
  const { student, question } = props;
  return (
    <Box>
      <StudentName student={student} />
      <Score question={question} />
    </Box>);
});


const Student = ({ index, question, student, ...props }) => useObserver(() => {
  const Component = index == 0 ? GradingStudent : CollapsedStudent;
  // not all students will be assigned the same questions
  const questionInfo = student.questions.find(q => q.id == question.id);
  if (!questionInfo) {
    return null;
  }
  return <Component key={student.role_id} index={index} question={questionInfo} student={student} {...props} />;
});


export default Student;
