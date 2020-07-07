import { React, observer, styled } from 'vendor';
import { Icon } from 'shared';
import { colors } from 'theme';
import SettingsIcon from '../../components/icons/settings';
import PublishScores from '../../components/buttons/publish-scores';

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

const StyledPublishScores = styled(PublishScores)`
    && {
      padding: 10px;
    }
`;

const Question = observer(({ heading, ux, index }) => {
  const stats = ux.showOnlyAttempted ? heading.gradedStats : heading.gradedStatsWithUnAttemptedResponses;
  const progress = ux.showOnlyAttempted ? heading.gradedProgress : heading.gradedProgressWithUnAttemptedResponses;
  return (
    <QuestionWrapper current={ux.selectedHeadingIndex == index} onClick={() => ux.goToQuestionHeading(index)} data-test-id={`question-${index}`}>
      <h6>{heading.title}</h6>
      {stats.complete ? <Icon type="check" color="green" /> : <span>{progress}</span>}
    </QuestionWrapper>
  );
});


const QuestionsBar = observer(({ ux }) => {
  return (
    <Bar data-test-id="questions-bar" className="questions-bar">
      <QuestionsWrapper>
        {ux.headings.map((heading, index) => <Question key={index} heading={heading} ux={ux} index={index} />)}
      </QuestionsWrapper>
      <Controls>
        <StyledPublishScores ux={ux} variant="default" />
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
