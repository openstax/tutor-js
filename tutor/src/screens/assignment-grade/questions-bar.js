import { React, useObserver, styled } from 'vendor';
import AsyncButton from 'shared/components/buttons/async-button';
import { Icon } from 'shared';
import { colors } from 'theme';
import SettingsIcon from '../../components/icons/settings';

const Bar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 2.4rem;
  border-top: 1px solid ${colors.neutral.pale};
  border-bottom: 1px solid ${colors.neutral.pale};
`;

const StyledSettingsIcon = styled(SettingsIcon)`
    border: 1px solid ${colors.neutral.pale};
    padding: 10px;
    margin-left: 20px;
`;

const QuestionWrapper = styled.button`
  border: 1px solid ${colors.neutral.pale};
  width: 6rem;
  height: 6rem;
  font-size: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${colors.neutral.thin};
  background-color: ${({ current }) => current ? colors.neutral.light : 'white'};
  h6 {
    color: ${colors.link};
  }
  & + & {
    border-left: 0;
  }
`;

const QuestionsWrapper = styled.div`
  display: flex;

`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  & .btn.btn-plain {
    border: 1px solid ${colors.neutral.pale};
    padding: 10px;
    margin-left: 20px;
    color: ${colors.neutral.grayblue}
  }
`;

const StyledPublishButton = styled(AsyncButton).attrs(props => ({
  disabled: props.isdisabled,
  variant: props.isdisabled ? 'plain' : 'primary',
}))`
  &&& {
    padding: 10px;
  }
`;

const Question = ({ heading, ux, index }) => useObserver(() => {
  const stats = heading.gradedStats;
  return (
    <QuestionWrapper current={ux.selectedHeadingIndex == index} onClick={() => ux.goToQuestionHeading(index)} data-test-id={`question-${index}`}>
      <h6>{heading.title}</h6>
      {stats.complete ? <Icon type="check" color="green" /> : <span>{heading.gradedProgress}</span>}
    </QuestionWrapper>
  );
});


const QuestionsBar = ({ ux }) => useObserver(() => {
  return (
    <Bar data-test-id="questions-bar" className="questions-bar">
      <QuestionsWrapper>
        {ux.headings.map((heading, index) => <Question key={index} heading={heading} ux={ux} index={index} />)}
      </QuestionsWrapper>
      <Controls>
        <StyledPublishButton
          isdisabled={!ux.hasUnpublishScores}
          onClick={ux.onPublishScores}
          isWaiting={ux.isPublishingScores}
          waitingText="Publishing...">
          Publish Scores
        </StyledPublishButton>
        <StyledSettingsIcon
          ux={ux}
          label="Adjust display settings"
          controls={{
            hideStudentNames: 'Hide student names',
            alphabetizeResponses: 'Show responses in alphabetical order',
            showOnlyAttempted: 'Show only attempted responses',
          }}
          moreInfo="Unattempted responses are assigned a zero after the due date. Students can submit late responses until the close date"
        />
      </Controls>
    </Bar>
  );
});


export default QuestionsBar;
