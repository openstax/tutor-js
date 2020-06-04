import { React, PropTypes, observer, useRef, useEffect, styled, css, cn } from 'vendor';
import { Button } from 'react-bootstrap';
import { colors } from 'theme';
import { useState } from 'react';
import { isNumber } from 'lodash';
import S from '../../helpers/string';

const Name=styled.div`
  font-weight: bold;
`;
const StudentName = observer(({ ux, student, index }) => {
  if (ux.hideStudentNames) {
    return <Name>{`Student ${index + 1}`}</Name>;
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
 ${props => props.onClick && css`
      cursor: pointer;
    `}
`;

const ScoreInput = styled.input`
  height: 4rem;
  display: flex;
  justify-content: center;
  text-align: center;
  width: 8rem;
  margin: 0 0.8rem;
  border: 2px solid ${colors.neutral.pale};
`;
const ScoreWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: .8rem;
`;

const Points = React.forwardRef(({ response, onChange }, ref) => {
  return (
    <ScoreWrapper>
      <b>Points:</b>
      <ScoreInput
        autoFocus
        type="number"
        min="0"
        max={response.availablePoints}
        step="0.1"
        name="score"
        placeholder="0.0"
        ref={ref}
        onChange={(e) => {
          if(e.target.value === '') onChange(undefined);
          else onChange(parseFloat(e.target.value, 10));
        }}
        defaultValue={response.grader_points}
        disabled={Boolean(!onChange)}
      /> out of {S.numberWithOneDecimalPlace(response.availablePoints)}
    </ScoreWrapper>
  );
});

Points.propTypes = {
  response: PropTypes.object.isRequired,
  onChange: PropTypes.func,
};

const Comment = styled.textarea`
  height: 8rem;
  width: 25rem;
  margin: 0.8rem 0;
  padding: 0.5rem;
  border: 1px solid ${colors.neutral.pale};
`;

const GradingStudentWrapper= styled(Box)`
  ${props => props.showShadow && css`
    box-shadow: 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 3px rgba(0,0,0,0.12), 0 4px 5px 0 rgba(0,0,0,0.2);
    border: none;
  `}
  ${props => !props.showShadow && css`
    border: 1px solid ${colors.neutral.pale};
  `}
  margin: 2rem 0;
`;

const SaveButton = styled(Button)`
  &&& {
    width: fit-content;
    margin-top: 10px;
    padding: none;
    margin-left: 0;
  }
`;

const Panel=styled.div`
  display: flex;
  flex-direction: column;
  ${Name} {
    margin-bottom: 2rem;
  }
`;

const GradingStudent = observer(({ response, ux, index }) => {
  const [points, setPoints] = useState(response.grader_points);
  const pointRef = useRef();
  const commentsRef = useRef();

  useEffect(() => {
    pointRef.current.select();
    pointRef.current.focus();
  }, []);
  
  const { student } = response;
  const saveLabel = ux.isResponseGraded(response)
    ? 'Regrade'
    : ux.isLastStudent
      ? 'Save & open next question'
      : 'Save';
  
  return (
    <GradingStudentWrapper data-student-id={student.id} data-test-id="student-answer" showShadow={!ux.isResponseGraded(response)}>
      <Panel>
        <StudentName ux={ux} student={student} index={index} />
        <p>{response.free_response}</p>
      </Panel>
      <Panel>
        <Points response={response} onChange={setPoints} ref={pointRef} />
        <b>Comment:</b>
        <Comment name="comment" defaultValue={response.gradedComments} ref={commentsRef} />
        {
          (!ux.isLastQuestion || !ux.isLastStudent || ux.isResponseGraded(response)) &&
          <SaveButton
            className="btn btn-standard btn-primary"
            disabled={!isNumber(points) || points > response.availablePoints || response.grader_points === points}
            onClick={() => ux.saveScore({
              response, points, comment: commentsRef.current.value, doGoToOverview: false, doMoveNextQuestion: ux.isLastStudent ? true : false,
            })}>
            {saveLabel}
          </SaveButton>
        }
        {ux.isLastStudent && !ux.isResponseGraded(response) && 
          <SaveButton
            variant="plain"
            className={cn('btn btn-standard', { 'btn-primary': ux.isLastQuestion })}
            disabled={!isNumber(points) || points > response.availablePoints || response.grader_points === points}
            onClick={() => ux.saveScore({
              response, points, comment: commentsRef.current.value, doGoToOverview: true,
            })}>
            {'Save & Exit'}
          </SaveButton>
        }
      </Panel>
    </GradingStudentWrapper>
  );
});

const CollapsedStudent = observer(({ ux, response, index }) => {
  return (
    <Box onClick={() => {
      if(ux)
        ux.selectedStudentIndex = index;
    }}
    >
      <StudentName ux={ux} student={response.student} />
      <Points response={response} />
    </Box>);
});


const Student = observer(({ index, response, ux, ...props }) => {
  let Component;
  const { student } = response;

  if (!ux) {
    Component = CollapsedStudent;
  }
  else if (ux.isResponseGraded(response))
    Component = GradingStudent;
  else 
    Component = ux.selectedStudentIndex === index ? GradingStudent : CollapsedStudent;
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
