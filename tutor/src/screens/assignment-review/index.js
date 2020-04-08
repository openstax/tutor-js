import { React, PropTypes, observer, styled, action, observable } from 'vendor';
import { ScrollToTop } from 'shared';
import Courses from '../../models/courses-map';
import Router from '../../helpers/router';
import LoadingScreen from 'shared/components/loading-animation';
import { withRouter } from 'react-router';
import UX from './ux';
import Tabs from '../../components/tabs';
import CoursePeriodSelect from '../../components/course-period-select';
import { navbars } from '../../theme.js';
import Details from './details';
import Overview from './overview';
import Scores from './scores';
import CourseBreadcrumb from '../../components/course-breadcrumb';

import './styles.scss';

const AvailableTabs = [Details, Overview, Scores];

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
      onComplete: this.onComplete,
    });
  }

  render() {
    const { isScoresReady, course, planScores, selectedPeriod, setSelectedPeriod } = this.ux;

    if (!isScoresReady) {
      return <LoadingScreen message="Loading Assignment…" />;
    }

    const Tab = AvailableTabs[this.tabIndex] || Details;

    return (
      <BackgroundWrapper>
        <ScrollToTop>
          <Heading>
            <CourseBreadcrumb
              course={course}
              currentTitle={planScores.title}
              titleSize="lg"
            />
            <CoursePeriodSelect period={selectedPeriod} course={course} onChange={setSelectedPeriod} />
          </Heading>
          <StyledTabs
            selectedIndex={this.tabIndex}
            params={this.props.params}
            onSelect={this.onTabSelection}
            tabs={AvailableTabs.map(t => t.title)}
          />
          <Tab ux={this.ux} />
        </ScrollToTop>
      </BackgroundWrapper>
    );
  }
}

export default AssignmentReview;
