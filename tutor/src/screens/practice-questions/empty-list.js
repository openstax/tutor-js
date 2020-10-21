import { React, styled } from 'vendor';
import { colors } from 'theme';
import SavePracticeButton from './save-practice-button';

const StyledWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 55px;

    .empty-practice-questions-content {
        text-align: center;
        font-size: 1.8rem;
        line-height: 3rem; 

        color: ${colors.darker};
        p:first-child {
            font-weight: 700;
        }
    }
`;

const PracticeQuestionsEmptyList = () => {
  return <StyledWrapper>
    <div className="empty-practice-questions-content">
      <p className="empty-practice-questions-header">No questions have been saved for practice.</p>
      <p>During an assignment, mark important questions to practice later.</p>
      <p>Click <SavePracticeButton disabled={true} /> from your assignment.</p>
    </div>
  </StyledWrapper>;
};

export default PracticeQuestionsEmptyList;
