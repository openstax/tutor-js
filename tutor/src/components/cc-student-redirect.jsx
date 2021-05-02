import PropTypes from 'prop-types';
import React from 'react';
import { Card } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { currentUser, currentCourses } from '../models';
import LogoutLink from './navbar/logout';
import CountdownRedirect from './countdown-redirect';


@observer
export default
class CCStudentRedirect extends React.Component {

    static propTypes = {
        courseId: PropTypes.string.isRequired,
    }

    render() {
        const { courseId } = this.props;
        const course = currentCourses.get(courseId);

        return (
            <Card className="cc-student-redirect">
                <p>
                    {'You are logged in as a student account '}
                    {currentUser.name}.
                </p>
                <div className="countdown">
                    <CountdownRedirect
                        redirectType="assign"
                        message="You are being redirected to your Concept Coach textbook"
                        destinationUrl={course.webview_url} />
                    <span> </span>
                    <a className="go-now" href={course.webview_url}>
            Go Now ❱
                    </a>
                </div>
                <ul>
                    <LogoutLink label="Or logout now to access your instructor account." />
                </ul>
            </Card>
        );
    }
}
