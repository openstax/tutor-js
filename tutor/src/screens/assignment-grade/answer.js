import { React, PropTypes, observer, useRef, useEffect, styled, css, cn, moment } from 'vendor';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { colors } from 'theme';
import { useState } from 'react';
import { isNumber } from 'lodash';
import ScoresHelper from '../../helpers/scores';

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

const Points = React.forwardRef(({ response, onChange, ux }, ref) => {
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
        defaultValue={ux.selectedHeading.dropped ? ScoresHelper.formatPoints(response.droppedQuestionPoints) : response.grader_points}
        disabled={Boolean(!onChange) || !ux.isStudentAvailableToGrade(response) || Boolean(ux.selectedHeading.dropped)}
      /> out of {ScoresHelper.formatPoints(response.availablePointsWithoutDropping)}
    </ScoreWrapper>
  );
});

Points.propTypes = {
  response: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  ux: PropTypes.object,
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

  > div:first-child {
    flex: 0 1 75%;
  }
`;

const SaveButton = styled(Button)`
  &&& {
    width: fit-content;
    margin-top: 10px;
    padding: none;
    margin-left: 0;
  }
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  ${Name} {
    margin-bottom: 2rem;
  }
`;

const StyledStudentAnswer = styled.div`
    display: flex;
    flex-flow: column;
    height: 100%;

   .regraded-info {
     margin-top: auto;
     color: ${colors.neutral.thin};
   }
`;

// Get the disable form tooltip info message
const getDisabledInfoTooltipMessage = (response, isStudentAvailableToGrade, questionDropped) => {
  let message = '';
  if(questionDropped) {
    message = 'This question has been dropped: ';
    // no credit message
    if (questionDropped.drop_method == 'zeroed') {
      message += 'question is worth 0 points.';
    }
    // full credit points message
    else {
      // student has not answered the question yet
      if (!response.is_completed) {
        message += 'Full credit will be assigned after the student attempts the question.';
      }
      else {
        message += 'full credit assigned.';
      }
    }
  }
  else if (!isStudentAvailableToGrade) {
    message = `You can grade this response after the extension due date: ${moment(response.student.extension.due_at).format('MM-DD-YYYY hh:mm a')}.`;
  }
  return message;
};

const GradingStudent = observer(({ response, ux, index }) => {
  const [points, setPoints] = useState(response.grader_points);
  const pointRef = useRef();
  const commentsRef = useRef();

  // students cannot be graded if a student has an extension and the current time is before the extension due date
  const isStudentAvailableToGrade = ux.isStudentAvailableToGrade(response);

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
  const droppedQuestion = ux.selectedHeading.dropped;
  const disabledInfoTooltipMessage = getDisabledInfoTooltipMessage(response, isStudentAvailableToGrade, droppedQuestion);

  return (
    <GradingStudentWrapper data-student-id={student.id} data-test-id="student-answer" showShadow={!ux.isResponseGraded(response)}>
      <Panel>
        <StyledStudentAnswer>
          <div>        
            <StudentName ux={ux} student={student} index={index} />
            <p>{response.free_response ? response.free_response : '(No response provided)'}</p>
          </div>
          {
            Boolean(droppedQuestion) && 
            <div className="regraded-info">
              <span>
                Regraded on {moment(droppedQuestion.updated_at).format('MMM D, YYYY [at] h:mm a')}.
                Previous grade: {ScoresHelper.formatPoints(response.grader_points || 0)}/{ScoresHelper.formatPoints(ux.selectedHeading.points_without_dropping)}
              </span>
            </div>
          }
        </StyledStudentAnswer>

      </Panel>
      <OverlayTrigger
        trigger={disabledInfoTooltipMessage ? ['hover', 'focus'] : null}
        overlay={
          <Tooltip>
            {disabledInfoTooltipMessage}
          </Tooltip>
        }>
        <Panel>
          <Points response={response} onChange={setPoints} ref={pointRef} ux={ux} />
          <b>Comment:</b>
          <Comment
            name="comment"
            defaultValue={response.gradedComments}
            ref={commentsRef}
            disabled={!isStudentAvailableToGrade || Boolean(droppedQuestion)} />
          {
            (!ux.isLastQuestion || !ux.isLastStudent || ux.isResponseGraded(response)) &&
            <SaveButton
              className="btn btn-standard btn-primary"
              disabled={
                !isNumber(points) ||
                points > response.availablePoints||
                response.grader_points === points ||
                !isStudentAvailableToGrade ||
                Boolean(droppedQuestion)}
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
      </OverlayTrigger>
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
      <Points response={response} ux={ux} />
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
