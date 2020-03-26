import { React, useObserver, useState, useParams, styled } from 'vendor';
import { ScrollToTop } from 'shared';
import UX from './ux';
import { navbars } from 'theme';
import QuestionsBar from './questions-bar';
import { QuestionPreview, QuestionHeader, ExerciseNumber, Question } from '../../components/homework-questions';
import CourseBreadcrumb from '../../components/course-breadcrumb';
import LoadingScreen from 'shared/components/loading-animation';
import Student from './student';
import './styles.scss';

const BackgroundWrapper = styled.div`
  background: #fff;
  min-height: calc(100vh - ${navbars.top.height} - ${navbars.bottom.height});
  position: relative;
  overflow: hidden;
  padding: 0 2.4rem;
`;

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AssignmentGrading = (props) => {
  const params = useParams();
  const [ux] = useState(() => new UX({ ...props, ...params }));
  return useObserver(() => {

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
          <QuestionPreview className="openstax-exercise-preview">
            <QuestionHeader variant="points">
              <ExerciseNumber>
                Question {ux.questionIndex + 1}
              </ExerciseNumber>
            </QuestionHeader>
            <div className="card-body">
              <Question
                className="openstax-question-preview"
                question={ux.selectedQuestion}
                hideAnswers={false}
                choicesEnabled={false}
                displayFormats={false}
                type="teacher-review"
              />
              {ux.unViewedStudents.map((student, index) =>
                <Student key={index} index={index} question={ux.selectedQuestion} student={student} ux={ux} />)}
            </div>
          </QuestionPreview>
        </ScrollToTop>
      </BackgroundWrapper>
    );

  });

};


export default AssignmentGrading;
