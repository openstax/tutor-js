import {
  React, PropTypes, observer, styled,
} from '../../../helpers/react';
import { ArbitraryHtmlAndMath } from 'shared';
import Question from 'shared/model/exercise/question';

const SyledQuestionStem = styled.div`
  font-size: 2rem;
  line-height: 1.68em;
`;

const QuestionStem = observer(({ question }) => {
  if (!question.stem_html) { return null; }

  return (
    <SyledQuestionStem>
      <ArbitraryHtmlAndMath html={question.stem_html} />
    </SyledQuestionStem>
  );
});

QuestionStem.propTypes = {
  question: PropTypes.instanceOf(Question).isRequired,
};

export default QuestionStem;
