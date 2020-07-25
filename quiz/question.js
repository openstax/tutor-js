import React, { useState } from 'react';
import styled from 'styled-components';
import { Question as TutorQuestion } from 'shared';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
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
