import { React, PropTypes, withRouter, observer, styled } from 'vendor';
import { ScrollToTop } from 'shared';
import UX from './ux';
import Courses from '../../models/courses-map';
import CourseBreadcrumb from '../../components/course-breadcrumb';
import LoadingScreen from 'shared/components/loading-animation';
import { BackgroundWrapper } from '../../helpers/background-wrapper';
import { colors } from 'theme';
import './styles.scss';
import QuestionsBar from './questions-bar';
import Question from './question';

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;


const BodyBackground = styled.div`
  padding: 4rem;
  background-color: ${colors.neutral.bright};
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
    course: PropTypes.object,
    history: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.ux = new UX();

    this.ux.initialize({
      ...props.params,
      course: props.course || Courses.get(props.params.courseId),
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

          <BodyBackground>

            <Question
              ux={ux}
              question={ux.selectedHeading.question}
            />

          </BodyBackground>
        </ScrollToTop>
      </BackgroundWrapper>
    );

  }
}


export default AssignmentGrading;
