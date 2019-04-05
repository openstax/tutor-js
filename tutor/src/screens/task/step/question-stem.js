import {
  React, PropTypes, observer, styled,
} from '../../../helpers/react';
import { ArbitraryHtmlAndMath } from 'shared';
import Question from 'shared/model/exercise/question';

const SyledQuestionStem = styled.div`
  font-size: 2rem;
  line-height: 1.68em;
  position: relative;
  &::before {
  content: attr(data-question-number) ")";
  position: absolute;
  z-index: 1;
  right: 100%;
  margin-right: 0.5rem;
  }
`;

const QuestionStem = observer(({ question, questionNumber }) => {
  return (
    <SyledQuestionStem data-question-number={questionNumber}>
      {question.stem_html &&
        <ArbitraryHtmlAndMath html={question.stem_html} />}
    </SyledQuestionStem>
  );
});
QuestionStem.displayName = 'QuestionStem';
QuestionStem.propTypes = {
  questionNumber: PropTypes.number.isRequired,
  question: PropTypes.instanceOf(Question).isRequired,
};

export default QuestionStem;
