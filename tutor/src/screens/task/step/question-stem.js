import {
  React, PropTypes, observer, styled,
} from 'vendor';
import { ArbitraryHtmlAndMath } from 'shared';
import Question from 'shared/model/exercise/question';

const SyledQuestionStem = styled.div`
  font-size: 2rem;
  line-height: 1.68em;
  position: relative;
  &[data-question-number]::before {
    content: attr(data-question-number) ")";
    position: absolute;
    z-index: 1;
    right: 100%;
    margin-right: 0.5rem;
  }
`;

const QuestionStem = observer(({ question, questionNumber }) => {
  const props = {};
  if (questionNumber) { props['data-question-number'] = questionNumber; }
  return (
    <SyledQuestionStem {...props}>
      {question.stem_html &&
        <ArbitraryHtmlAndMath html={question.stem_html} />}
    </SyledQuestionStem>
  );
});
QuestionStem.displayName = 'QuestionStem';
QuestionStem.propTypes = {
  questionNumber: PropTypes.number,
  question: PropTypes.instanceOf(Question).isRequired,
};

export default QuestionStem;
