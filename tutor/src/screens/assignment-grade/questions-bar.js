import { React, useObserver, styled } from 'vendor';
import { Button } from 'react-bootstrap';
import { Icon } from 'shared';
import { colors } from 'theme';

const Bar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 2.4rem;
  border-top: 1px solid ${colors.neutral.lite};
  border-bottom: 1px solid ${colors.neutral.lite};
`;

const QuestionWrapper = styled.button`
  border: 1px solid blue;
  width: 6rem;
  height: 8rem;
  font-size: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${colors.neutral.thin};
  background-color: ${({ current }) => current ? colors.neutral.pale : 'white'};
  h6 {
    color: blue;
  }
`;

const QuestionsWrapper = styled.div`
  display: flex;

`;

const Controls = styled.div`
  display: flex;
  align-items: center;
`;

const Question = ({ heading, ux, index }) => useObserver(() => {

  return (
    <QuestionWrapper current={ux.questionIndex == index} onClick={() => ux.setQuestionIndex(index)}>
      <h6>{heading.title}</h6>
      {ux.wasQuestionViewed(index) ? <Icon type="check" color="green" /> : <span>(24/25)</span>}
    </QuestionWrapper>
  );
});


const QuestionsBar = ({ ux }) => useObserver(() => {

  return (
    <Bar data-test-id="questions-bar">
      <QuestionsWrapper>
        {ux.scores.coreQuestionHeadings.map((heading, index) =>
          <Question key={index} heading={heading} ux={ux} index={index} />)}
      </QuestionsWrapper>
      <Controls>
        <Button>Publish Scores</Button>
        <Icon type="cog" />
      </Controls>
    </Bar>
  );
});


export default QuestionsBar;
