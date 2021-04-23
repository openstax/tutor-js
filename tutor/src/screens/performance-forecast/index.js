import { React, observer } from 'vendor'
import { ScrollToTop } from 'shared';
import Router from '../../helpers/router';
import Header from '../../components/header';
import LoadingScreen from 'shared/components/loading-animation';
import Teacher from './teacher';
import Student from './student';
import TeacherStudent from './teacher-student';
import { currentCourses } from '../../models';

import './styles.scss';


//eslint-disable-next-line react/prefer-stateless-function
@observer
class Guide extends React.Component {
    static displayName = 'PerformanceForecastGuide';

    get course() {
        // eslint-disable-next-line react/prop-types
        return this.props.course || currentCourses.get(Router.currentParams().courseId)
    }

    constructor(props) {
        super(props)
        this.course.performance.fetch()
    }

    render() {
        const { courseId, roleId } = Router.currentParams();
        const { course, course: { performance, currentRole: { isTeacher } } } = this;
        let body;

        if (performance.api.isFetchInProgress) {
            body = <LoadingScreen message="Loading performance guide…" />;
        } else if ((roleId != null) && isTeacher) {
            body = <TeacherStudent course={course}  />;
        } else if (isTeacher) {
            body = <Teacher course={course} />;
        } else {
            body = <Student course={course}  />;
        }
        return (
            <ScrollToTop>
                <Header 
                    unDocked={true}
                    title="Performance Forecast"
                    backTo={Router.makePathname('dashboard', { courseId })}
                    backToText='Dashboard'
                />
                {body}
            </ScrollToTop>
        );
    }
}


export { Teacher, TeacherStudent, Student, Guide };
export default Guide;
