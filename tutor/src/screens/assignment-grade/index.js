import { React, PropTypes, withRouter, observer, styled } from 'vendor';
import { ScrollToTop } from 'shared';
import UX from './ux';
import QuestionsBar from './questions-bar';
import { QuestionPreview, QuestionHeader, ExerciseNumber, Question } from '../../components/homework-questions';
import CourseBreadcrumb from '../../components/course-breadcrumb';
import LoadingScreen from 'shared/components/loading-animation';
import Student from './student';
import { BackgroundWrapper } from '../../helpers/background-wrapper';

import './styles.scss';

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const QuestionWithAnswer = styled(QuestionPreview)`
  padding: 4rem;
`;

@withRouter
@observer
class AssignmentGrading extends React.Component {

  static displayName = 'AssignmentGrading';

  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
      courseId: PropTypes.string.isRequired,
    }),
    history: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.ux = new UX();

    this.ux.initialize({
      ...props.params,
      history: props.history,
      onComplete: this.onComplete,
    });
  }

  render() {
    const { ux } = this;

    if (!ux.isExercisesReady) {
      return <LoadingScreen message="Loading Assignment…" />;
    }

    return (
      <BackgroundWrapper>
        <ScrollToTop>
          <Heading>
            <CourseBreadcrumb
              course={ux.course}
              currentTitle={ux.planScores.title}
              titleSize="lg"
            />
          </Heading>
          <QuestionsBar ux={ux} />
          <QuestionWithAnswer>
            <QuestionHeader variant="points">
              <ExerciseNumber>
                Question {ux.questionIndex + 1}
              </ExerciseNumber>
            </QuestionHeader>
            <div className="card-body">
              <Question
                question={ux.selectedQuestion}
                hideAnswers={false}
                answer_id={ux.selectedAnswerId}
                correct_answer_id={ux.correctAnswerid}
                choicesEnabled={false}
                displayFormats={false}
              />
              {ux.unGradedStudents.map((student, index) =>
                <Student key={index} index={index} question={ux.selectedQuestion} student={student} ux={ux} />)}
            </div>
          </QuestionWithAnswer>
        </ScrollToTop>
      </BackgroundWrapper>
    );

  }
}


export default AssignmentGrading;
