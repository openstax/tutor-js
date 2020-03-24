import { React, PropTypes, cn, styled, observer, css } from 'vendor';
import { colors } from 'theme';
import Question from 'shared/components/question';

const HomeworkQuestionsWrapper = styled.div`

`;

const QuestionPreview = styled.div`
  border: 1px solid ${colors.neutral.lighter};
  margin: 2.4rem 0;
  &:first-of-type {
   .ox-icon-arrow-up { display: none; }
  }
  &:last-of-type {
   .ox-icon-arrow-down { display: none; }
  }
`;


const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: ${colors.neutral.lighter}
  padding: 1rem;
  margin-bottom: 1rem;
  font-weight: bold;

  ${props => props.variant === 'submission' && css`
    background: ${colors.templates.homework.background};
    font-size: 1.8rem;
    font-weight: normal;
    padding: 1.4rem 5rem;
  `}
`;


const ExerciseNumber = styled.div`
  font-size: 1.5rem;

  ${props => props.variant === 'submission' && css`
    font-size: 1.8rem;
    font-weight: bold;
  `}
`;
export { ExerciseNumber };

const ReviewExerciseCard = observer(({
  index, info,
  questionInfoRenderer: QuestionInfo,
  headerContentRenderer: HeaderContent,
  questionType = 'teacher-preview',
  styleVariant = 'points',
}) => (
  <QuestionPreview className="openstax-exercise-preview">
    <Header variant={styleVariant}>
      <HeaderContent styleVariant={styleVariant} info={info} label={`Question ${index + 1}`} />
    </Header>
    <div className="card-body">
      <Question
        className="openstax-question-preview"
        question={info.question}
        hideAnswers={false}
        choicesEnabled={false}
        displayFormats={false}
        type={questionType}
      />
      {QuestionInfo && <QuestionInfo info={info} />}
    </div>
  </QuestionPreview>
));
ReviewExerciseCard.dislayName = 'ReviewExerciseCard';
ReviewExerciseCard.propTypes = {
  headerContentRenderer: PropTypes.func.isRequired,
  questionInfoRenderer: PropTypes.func,
};

const HomeworkQuestions = observer(({
  questionsInfo,
  questionType,
  className,
  headerContentRenderer,
  questionInfoRenderer,
  styleVariant,
}) => (
  <HomeworkQuestionsWrapper className={cn('homework-questions', className)}>
    {questionsInfo.map((info, index) => (
      <ReviewExerciseCard
        info={info}
        index={index}
        questionType={questionType}
        key={info.key}
        headerContentRenderer={headerContentRenderer}
        questionInfoRenderer={questionInfoRenderer}
        styleVariant={styleVariant}
      />
    ))}
  </HomeworkQuestionsWrapper>
));

HomeworkQuestions.displayName = 'HomeworkQuestions';
HomeworkQuestions.propTypes = {
  headerContentRenderer: PropTypes.func.isRequired,
  questionInfoRenderer: PropTypes.func,
  questionType: PropTypes.string,
  questionsInfo: PropTypes.array.isRequired,
  styleVariant: PropTypes.string,
};
export default HomeworkQuestions;
