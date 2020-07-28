import React, { useState } from 'react';
import styled from 'styled-components';
import { Question as TutorQuestion } from 'shared';

// button has padding on openstax.org, override it
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  .question-stem {
     font-size: 18px;
     line-height 28px;
  }
  button {
    padding: 0;
  }
`;

const Question = ({ exercise }) => {
  const [answerId, setAnswerId] = useState(exercise.selectedAnswerId);

  const onChange = (answer) => {
    exercise.selectedAnswerId = answer.id;
    setAnswerId(answer.id);
  };

  return (
    <Wrapper>
      <TutorQuestion
        question={exercise.asTutorQuestion}
        answer_id={answerId}
        correct_answer_id={exercise.selectedAnswerId && exercise.correctAnswer.id}
        onChange={onChange}
        choicesEnabled
      />
      
    </Wrapper>
  );
};

export default Question;
