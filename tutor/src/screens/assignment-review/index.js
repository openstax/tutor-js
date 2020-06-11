import { React, PropTypes, observer, styled, action, observable } from 'vendor';
import { ScrollToTop } from 'shared';
import Courses from '../../models/courses-map';
import Router from '../../helpers/router';
import LoadingScreen from 'shared/components/loading-animation';
import { withRouter } from 'react-router';
import UX from './ux';
import Tabs from '../../components/tabs';
import CoursePeriodSelect from '../../components/course-period-select';
import Details from './details';
import Overview from './overview';
import Scores from './scores';
import ExternalScores from './external-scores';
import CourseBreadcrumb from '../../components/course-breadcrumb';
import { BackgroundWrapper, ContentWrapper } from '../../helpers/background-wrapper';

import './styles.scss';


const Heading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledTabs = styled(Tabs)`
  && > .nav-tabs li a {
    text-transform: capitalize;
  }
`;


@withRouter
@observer
class AssignmentReview extends React.Component {

  static displayName = 'AssignmentReview';

  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
      courseId: PropTypes.string.isRequired,
    }),
    history: PropTypes.object.isRequired,
  }

  @observable tabIndex = 0;

  @action.bound onTabSelection(tabIndex) {
    this.tabIndex = tabIndex;
  }

  constructor(props) {
    super(props);

    // eslint-disable-next-line
    let { id, courseId, type } = props.params;

    // eslint-disable-next-line
    const course = props.course || Courses.get(courseId);

    this.ux = new UX();

    this.ux.initialize({
      ...Router.currentQuery(),
      ...props.params,
      history: props.history,
      course,
      onCompleteDelete: this.onCompleteDelete,
      onEditAssignedQuestions: this.onEditAssignedQuestions,
      onTabSelection: this.onTabSelection,
    });
  }

  @action.bound onCompleteDelete(date) {
    const { ux } = this;
    this.props.history.push(
      Router.makePathname('calendarByDate', {
        courseId: ux.course.id,
        date: date,
      })
    );
  }

  @action.bound onEditAssignedQuestions() {
    const { courseId, id } = this.props.params;
    this.props.history.push(
      Router.makePathname('editAssignment', {
        courseId: courseId,
        type: 'homework',
        id: id,
        step: 'points',
      })
    );
  }

  render() {
    const {
      isScoresReady, course, planScores, assignedPeriods, selectedPeriod, setSelectedPeriod,
      scores: taskPlanScores, isReadingOrHomework,
    } = this.ux;

    if (!isScoresReady) {
      return <LoadingScreen message="Loading Assignment…" />;
    }

    const AvailableTabs = [Details];
    // there are no scores if no students have enrolled
    if (taskPlanScores) {
      if (isReadingOrHomework) {
        AvailableTabs.push(Overview);
      }
      if (!course.uses_pre_wrm_scores) {
        AvailableTabs.push(Scores);
      }
      if (taskPlanScores.scores.isExternal) {
        AvailableTabs.push(ExternalScores);
      }
    }

    const Tab = AvailableTabs[this.tabIndex] || Details;

    return (
      <BackgroundWrapper>
        <ScrollToTop>
          <ContentWrapper>
            <Heading>
              <CourseBreadcrumb
                course={course}
                currentTitle={planScores.title}
              />
              <CoursePeriodSelect
                period={selectedPeriod}
                periods={assignedPeriods}
                course={course}
                onChange={setSelectedPeriod}
              />
            </Heading>
            <StyledTabs
              selectedIndex={this.tabIndex}
              params={this.props.params}
              onSelect={this.onTabSelection}
              tabs={AvailableTabs.map(t => t.title)}
            />
            <Tab ux={this.ux} />
          </ContentWrapper>
        </ScrollToTop>
      </BackgroundWrapper>
    );
  }
}

export default AssignmentReview;
