import { React, useObserver, styled, css } from 'vendor';
import { Button } from 'react-bootstrap';
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

const StyledPublishButton = styled(Button).attrs(props => ({
  disabled: props.isDisabled,
  variant: props.isDisabled ? 'plain' : 'primary',
}))`
  &&& {
    padding: 10px;
  }
`;

const Question = ({ heading, ux }) => useObserver(() => {
  const stats = heading.gradedStats;
  return (
    <QuestionWrapper current={ux.selectedHeading == heading} onClick={() => ux.setHeading(heading)}>
      <h6>{heading.title}</h6>
      {stats.complete ? <Icon type="check" color="green" /> : <span>{heading.gradedProgress}</span>}
    </QuestionWrapper>
  );
});


const QuestionsBar = ({ ux }) => useObserver(() => {
  return (
    <Bar data-test-id="questions-bar" className="questions-bar">
      <QuestionsWrapper>
        {ux.headings.map((heading, index) => <Question key={index} heading={heading} ux={ux} />)}
      </QuestionsWrapper>
      <Controls>
        <StyledPublishButton
          isDisabled={!ux.scores.hasUnPublishedScores}
          onClick={ux.onPublishScores}>
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
          moreInfo="Unattempted responses are assigned a zero after the due date. Students can submit responses until the close date"
        />
      </Controls>
    </Bar>
  );
});


export default QuestionsBar;
