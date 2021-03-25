import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import CourseGroupingLabel from './course-grouping-label';
import Router from '../helpers/router';

@withRouter
class NoPeriods extends React.Component {
    static propTypes = {
        courseId: PropTypes.string.isRequired,
        button:   PropTypes.element,
        history: PropTypes.object.isRequired,
    };

    onAddSection = () => {
        return this.props.history.push(
            Router.makePathname('courseRoster',
                { courseId: this.props.courseId },
                { query: { add: true } }
            )
        );
    };

    AddButton = () => {
        return (
            <Button
                className="no-periods-course-settings-link"
                variant="primary"
                onClick={this.onAddSection}
            >
        Add a <CourseGroupingLabel courseId={this.props.courseId} />
            </Button>
        );
    };

    render() {

        return (
            <div className="no-periods-message">
                <p>
          Please add at least
          one <CourseGroupingLabel courseId={this.props.courseId} lowercase={true} /> to the course.
                </p>
                {this.props.button || React.createElement(this.AddButton, null)}
            </div>
        );
    }
}

export default NoPeriods;
