import { React, PropTypes, cn, styled, observer, css } from 'vendor';
import { colors } from 'theme';
import Question from 'shared/components/question';
import { DroppedReviewExerciseIndicator } from './dropped-question';

const HomeworkQuestionsWrapper = styled.div`

`;

const QuestionPreview = styled.div`
  border: 1px solid ${colors.neutral.pale};
  margin: 2.4rem 0;
  &:first-of-type {
   .ox-icon-arrow-up { display: none; }
  }
  &:last-of-type {
   .ox-icon-arrow-down { display: none; }
  }
  .frame-wrapper {
    width: 100%;
    min-width: 100%;
    margin: 0;
  }
`;


const QuestionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: ${colors.neutral.lighter};
  padding: 1rem;
  font-weight: bold;
  ${props => (props.variant === 'submission' || props.variant === 'reading') && css`
    ${!props.isDropped && css`
        background: ${props.variant === 'reading' ? colors.templates.reading.background : colors.templates.homework.background};
    `}
    font-size: 1.8rem;
    font-weight: normal;
    padding: 1.4rem 2.2rem;
  `}
`;

const Body = styled.div`
  ${props => (props.variant === 'submission' || props.variant === 'reading') && css`
    && {
      background: ${colors.assignments.submissions.background};
      padding: 3.2rem 2.8rem;

      &.card-body .question-stem {
        font-size: 1.8rem;
        font-weight: normal;
        line-height: 3.0rem;
        margin-bottom: 2.2rem;
      }

      .answer-answer {
        margin: 0.25rem 0 0;
        font-size: 1.6rem;
      }
    }

    .review-wrapper {
      margin-bottom: 1.2rem;
      display: flex;
      align-items: center;

      .answer-answer { margin: 0; }
    }

    .review-count {
      align-self: flex-start;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 25%/50%;
      min-width: 5.6rem;
      padding: 0.1rem;
      margin-right: 1.6rem;
      font-weight: bold;

      .selected-count {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 2.5rem;
        height: 1.9rem;
        margin-right: 0.2rem;
        border-right: 1px solid rgba(0,0,0,0.15);
        font-size: 1.4rem;
      }

      .letter {
        height: 2.5rem;
        width: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border: 1px solid rgba(0,0,0,0.25);
        border-radius: 100%;
        font-size: 1.2rem;
      }

      &.red {
        background: #FFE6EA;
        .selected-count {
          color:  #C22032;
          border-color: #E9C4CA;
        }
      }
      &.green {
        background: #ECF7D1;
        color:  #3B7800;
        .selected-count {
          border-color: #D7E3B8;
        }
      }
    }

    .letter {
      height: 2.5rem;
      width: 2.5rem;
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      background: #fff;
      border: 1px solid rgba(0,0,0,0.25);
      border-radius: 100%;
      font-size: 1.2rem;

      &.red {
        border-color: rgba(194,32,50,0.5);
        color: ${colors.neutral.grayblue};
      }

      &.green {
        background-color: #63A524;
        color: #fff;
        border-color: #4B8315;
      }
    }

    .section-link-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      &.singular {
        justify-content: flex-end;
      }
      & + div {
        margin-top: 1.3rem;
      }
      .tags > * {
        margin-right: 1rem;
        color: ${colors.neutral.lite};
      }
      .chapter-section {
        color: inherit;
      }
      .book-part-title > span {
        text-decoration: underline;
      }
    }
  `}
`;

const ExerciseNumber = styled.div`
  font-size: 1.6rem;

  ${props => (props.variant === 'submission' || props.variant === 'reading') && css`
    font-size: 1.8rem;
    font-weight: bold;
  `}
`;

export { Question, QuestionPreview, QuestionHeader, ExerciseNumber };


const ReviewExerciseCard = observer(({
    index, info,
    sectionLinkRenderer: SectionLink,
    questionInfoRenderer: QuestionInfo,
    headerContentRenderer: HeaderContent,
    footerContentRenderer: FooterContent,
    questionType = 'teacher-preview',
    styleVariant = 'points',
}) => {
    const isDropped = !!info.droppedQuestion;
    return (
        <QuestionPreview className="openstax-exercise-preview">
            <QuestionHeader variant={styleVariant} isDropped={isDropped} className="question-header">
                {isDropped && <DroppedReviewExerciseIndicator info={info}/>}
                <HeaderContent
                    styleVariant={styleVariant}
                    info={info}
                    label={`Question ${index + 1}`}
                />
            </QuestionHeader>
            <Body className="card-body" variant={styleVariant}>
                <Question
                    className="openstax-question-preview"
                    question={info.question}
                    hideAnswers={false}
                    choicesEnabled={false}
                    displayFormats={false}
                    type={questionType}
                />
                {SectionLink && <SectionLink info={info} /> }
                {QuestionInfo && <QuestionInfo info={info} />}
                {FooterContent && <FooterContent info={info} />}
            </Body>
        </QuestionPreview>
    );
});
ReviewExerciseCard.dislayName = 'ReviewExerciseCard';
ReviewExerciseCard.propTypes = {
    headerContentRenderer: PropTypes.func.isRequired,
    questionInfoRenderer: PropTypes.func,
    footerContentRenderer: PropTypes.func,
};

const HomeworkQuestions = observer(({
    questionsInfo,
    questionType,
    className,
    sectionLinkRenderer,
    headerContentRenderer,
    questionInfoRenderer,
    footerContentRenderer,
    styleVariant,
}) => (
    <HomeworkQuestionsWrapper className={cn('homework-questions', className)}>
        {questionsInfo.map((info, index) => (
            <ReviewExerciseCard
                info={info}
                index={index}
                questionType={questionType}
                key={info.key}
                sectionLinkRenderer={sectionLinkRenderer}
                headerContentRenderer={headerContentRenderer}
                questionInfoRenderer={questionInfoRenderer}
                footerContentRenderer={footerContentRenderer}
                styleVariant={styleVariant}
            />
        ))}
    </HomeworkQuestionsWrapper>
));

HomeworkQuestions.displayName = 'HomeworkQuestions';
HomeworkQuestions.propTypes = {
    headerContentRenderer: PropTypes.func.isRequired,
    questionInfoRenderer: PropTypes.func,
    footerContentRenderer: PropTypes.func,
    questionType: PropTypes.string,
    questionsInfo: PropTypes.array.isRequired,
    styleVariant: PropTypes.string,
};
export default HomeworkQuestions;
