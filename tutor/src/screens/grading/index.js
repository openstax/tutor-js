import { React, PropTypes, observer, styled, action, observable } from 'vendor';
import { ScrollToTop } from 'shared';
import Courses from '../../models/courses-map';
import Router from '../../helpers/router';
import LoadingScreen from 'shared/components/loading-animation';
import { withRouter } from 'react-router';
import UX from './ux';
import Tabs from '../../components/tabs';
import { navbars } from '../../theme.js';
import Details from './details';
import Overview from './overview';
import Scores from './scores';

import './styles.scss';

const AvailableTabs = [Details, Overview, Scores];

const BackgroundWrapper = styled.div`
  background: #fff;
  min-height: calc(100vh - ${navbars.top.height} - ${navbars.bottom.height});
  position: relative;
  overflow: hidden;
  padding: 0 2.4rem;
`;

@withRouter
@observer
class Grading extends React.Component {

  static displayName = 'AssignmentBuilder';

  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
      courseId: PropTypes.string.isRequired,
    }),
    history: PropTypes.object.isRequired,
  }

  @observable tabIndex = 1;

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
    const { isReady, course, plan } = this.ux;

    if (!isReady) {
      return <LoadingScreen message="Loading Assignment…" />;
    }

    const Tab = AvailableTabs[this.tabIndex] || Overview;

    return (
      <BackgroundWrapper>
        <ScrollToTop>
          {course.name} >
          <h1>{plan.title}</h1>
          <Tabs
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

export default Grading;
