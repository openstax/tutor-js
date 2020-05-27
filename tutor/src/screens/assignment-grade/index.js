import { React, PropTypes, withRouter, observer, styled } from 'vendor';
import { ScrollToTop } from 'shared';
import LoadingScreen from 'shared/components/loading-animation';
import UX from './ux';
import QuestionsBar from './questions-bar';
import Question from './question';
import Courses from '../../models/courses-map';
import CourseBreadcrumb from '../../components/course-breadcrumb';
import { BackgroundWrapper } from '../../helpers/background-wrapper';
import CoursePeriodSelect from '../../components/course-period-select';
import { colors } from 'theme';
import './styles.scss';

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 3.5rem;
  line-height: 4.5rem;
  margin: 0;
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
          <div>    
            <CourseBreadcrumb
              course={ux.course}
              plan={{
                title: ux.planScores.title,
                id: ux.planScores.id,
              }}
              currentTitle="Grade Answers"
            />
            <Heading>
              <Title>Grade Answers</Title>    
              <CoursePeriodSelect period={ux.selectedPeriod} course={ux.course} onChange={ux.setSelectedPeriod} />
            </Heading>
          </div>
          <QuestionsBar ux={ux} />
          <BodyBackground>
            <Question
              ux={ux}
            />
          </BodyBackground>
        </ScrollToTop>
      </BackgroundWrapper>
    );

  }
}


export default AssignmentGrading;
