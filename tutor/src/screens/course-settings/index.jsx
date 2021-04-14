import { React, PropTypes, observable, observer, action, computed, styled } from 'vendor';
import { Redirect } from 'react-router-dom';
import { currentCourses } from '../../models';
import Router from '../../../src/helpers/router';
import CoursePage from '../../components/course-page';
import Tabs from '../../components/tabs';
import CourseBreadcrumb from '../../components/course-breadcrumb';
import StudentAccess from './student-access';
import CourseDetails from './course-details';
import './styles.scss';

const StyledCourseSettings = styled(CoursePage)`
  &&& .body-wrapper {
    padding: 0 40px;
    .body {
      padding-top: 10px;
    }
  }
`;

@observer
export default
class CourseSettings extends React.Component {

    static propTypes = {
        params: PropTypes.shape({
            courseId: PropTypes.string.isRequired,
        }).isRequired,
        history: PropTypes.shape({
            push: PropTypes.func,
        }).isRequired,
    }

    componentDidMount() {
        this.course?.roster.fetch();
    }

    @observable tabIndex;

    @computed get course() {
        return currentCourses.get(this.props.params.courseId);
    }

    @action.bound onTabSelect(tabIndex) {
        this.tabIndex = tabIndex;
    }

    renderAccess() {
        return (
            <StudentAccess course={this.course} />
        );
    }

    renderCourseDetails() {
        return (
            <CourseDetails course={this.course} history={this.props.history} />
        );
    }

    renderTitleBreadcrumbs() {
        return <CourseBreadcrumb course={this.course} currentTitle="Course Settings" noBottomMargin />;
    }

    render() {
        const { course, tabIndex } = this;
        if (!course) {
            return <Redirect to={Router.makePathname('myCourses')} />;
        }
        return (
            <StyledCourseSettings
                className="settings"
                course={course}
                titleBreadcrumbs={this.renderTitleBreadcrumbs()}
                titleAppearance="light"
                controlBackgroundColor='white'
            >
                <Tabs
                    tabs={['STUDENT ACCESS', 'COURSE DETAILS']}
                    onSelect={this.onTabSelect}
                />
                {tabIndex ? this.renderCourseDetails() : this.renderAccess()}
            </StyledCourseSettings>
        );
    }
}
