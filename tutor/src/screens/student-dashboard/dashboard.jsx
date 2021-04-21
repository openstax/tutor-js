import { React, PropTypes, action, observable, observer, withRouter, styled, modelize } from 'vendor';
import { Row, Col, Card } from 'react-bootstrap';
import { includes } from 'lodash';
import UpcomingCard from './upcoming-panel';
import AllEventsByWeek from './all-events-by-week';
import ThisWeekCard from './this-week-panel';
import ProgressGuideShell from './progress-guide';
import BrowseTheBook from '../../components/buttons/browse-the-book';
import CourseTitleBanner from '../../components/course-title-banner';
import { Course } from '../../models';
import Tabs from '../../components/tabs';
import { NotificationsBar } from 'shared';
import NotificationHelpers from '../../helpers/notifications';
import TourRegion from '../../components/tours/region';
import Surveys from './surveys';

const DashboardSectionRow = styled(Row)`
  > div {
    margin-top: 25px;
  }
`;

@withRouter
@observer
export default
class StudentDashboard extends React.Component {
    static propTypes = {
        course: PropTypes.instanceOf(Course).isRequired,
        params: PropTypes.object.isRequired,
        // router's history is needed for Navbar helpers
        history: PropTypes.object.isRequired,
    }

    @observable tabIndex = 0;

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound
    onTabSelection(tabIndex, ev) {
        if (includes([0, 1], tabIndex)) {
            this.tabIndex = tabIndex;
        } else {
            ev.preventDefault();
        }
    }

    renderPastWork(course) {
        return (
            <div className="tab-pane active" role="tabpanel">
                <AllEventsByWeek course={course} />
            </div>
        );
    }

    renderThisWeek(course) {
        return (
            <div className="tab-pane active" role="tabpanel">
                <ThisWeekCard course={course} />
                <UpcomingCard course={course} />
            </div>
        );
    }

    render() {
        const { tabIndex, props: { course } } = this;

        return (
            <div className="student-dashboard">
                <NotificationsBar
                    role={course.primaryRole.toJSON()}
                    course={course.toJSON()}
                    callbacks={NotificationHelpers.buildCallbackHandlers(this)} />
                <CourseTitleBanner courseId={course.id} />
                <TourRegion
                    id="student-dashboard"
                    otherTours={['about-late', 'assignment-progress']}
                    courseId={course.id}
                    className="container"
                >
                    <Row>
                        <Tabs
                            className="student-dashboard-tabs"
                            params={this.props.params}
                            onSelect={this.onTabSelection}
                            tabs={['This Week', 'All Past Work']} />
                    </Row>
                    <DashboardSectionRow>
                        <Col xs={12} lg={9}>
                            {tabIndex === 0 ? this.renderThisWeek(course) : this.renderPastWork(course)}
                        </Col>
                        <Col xs={12} lg={3} className="sidebar">
                            <Surveys course={course} />
                            <ProgressGuideShell courseId={course.id} />
                            <Card className="actions-box browse-the-book">
                                <BrowseTheBook
                                    unstyled
                                    course={course}
                                    data-appearance={course.appearance_code}
                                >
                                    <div>Browse the Book</div>
                                </BrowseTheBook>
                            </Card>
                        </Col>
                    </DashboardSectionRow>
                </TourRegion>
            </div>
        );
    }
}
