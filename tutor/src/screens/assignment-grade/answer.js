import { React, PropTypes, observer, useRef, useEffect, styled } from 'vendor';
import { Button } from 'react-bootstrap';
import { colors } from 'theme';

const Name=styled.div`
  font-weight: bold;
`;
const StudentName = observer(({ ux, student }) => {
  if (ux.hideStudentNames) {
    return null;
  }
  return(
    <Name>{student.last_name}, {student.first_name}</Name>
  );
});
StudentName.propTypes = {
  student: PropTypes.object.isRequired,
};

const Box = styled.div`
 min-height: 7rem;
 padding: 2rem;
 display: flex;
 justify-content: space-between;
 border: 2px solid ${colors.neutral.pale};
 & + & {
   margin-top: 1rem;
 }
`;

const ScoreInput = styled.input`
  height: 4rem;
  display: flex;
  justify-contenten: center;
  text-align: center;
  width: 5rem;
  margin: 0 0.8rem;
`;
const ScoreWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: .8rem;
`;
const Score = React.forwardRef(({ response }, ref) => {
  return (
    <ScoreWrapper>
      <b>Score:</b>
      <ScoreInput
        autoFocus
        name="score" ref={ref}
        defaultValue={response.gradedPoints}
      /> out of {response.availablePoints}
    </ScoreWrapper>
  );
});

Score.propTypes = {
  response: PropTypes.object.isRequired,
};

const Comment=styled.textarea`
  height: 8rem;
  width: 25rem;
  margin: 0.8rem 0;
  padding: 0.5rem;
  border: 1px solid ${colors.neutral.pale};
`;

const GradingStudentWrapper=styled(Box)`
  box-shadow: 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 3px rgba(0,0,0,0.12), 0 4px 5px 0 rgba(0,0,0,0.2);
  margin: 2rem 0;
`;

const SaveButton = styled(Button)`
  max-width: 120px;
`;

const Panel=styled.div`
  display: flex;
  flex-direction: column;
  ${Name} {
    margin-bottom: 2rem;
  }
`;

const GradingStudent = observer(({ response, ux }) => {
  const scoreRef = useRef();
  const commentsRef = useRef();
  useEffect(() => {
    scoreRef.current.select();
    scoreRef.current.focus();
  }, []);
  
  const { student } = response;
  return (
    <GradingStudentWrapper data-student-id={student.id} data-test-id="student-answer">
      <Panel>
        <StudentName ux={ux} student={student} />
        <p>{response.free_response}</p>
      </Panel>
      <Panel>
        <Score response={response} ref={scoreRef} />
        <b>Comment:</b>
        <Comment name="comment" defaultValue={response.gradedComments} ref={commentsRef} />
        <SaveButton onClick={() => ux.saveScore({
          student, response, points: scoreRef.current.value, comment: commentsRef.current.value,
        })}>Save</SaveButton>
      </Panel>
    </GradingStudentWrapper>
  );
});

const CollapsedStudent = observer(({ ux, response }) => {
  return (
    <Box>
      <StudentName ux={ux} student={response.student} />
      <Score response={response} />
    </Box>);
});


const Student = observer(({ index, response, ux, ...props }) => {
  const Component = index == 0 ? GradingStudent : CollapsedStudent;
  const { student } = response;
  return (
    <Component
      key={response.task_step_id}
      ux={ux}
      index={index}
      response={response}
      student={student}
      {...props}
    />
  );
});


export default Student;
