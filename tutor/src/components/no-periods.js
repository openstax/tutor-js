import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'react-bootstrap';
import CourseGroupingLabel from './course-grouping-label';
import Router from '../helpers/router';

class NoPeriods extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    courseId: PropTypes.string.isRequired,
    button:   PropTypes.element,
  };

  onAddSection = () => {
    return this.context.router.history.push(
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
        onClick={this.onAddSection}>
        {'\
    Add a '}
        <CourseGroupingLabel courseId={this.props.courseId} />
      </Button>
    );
  };

  render() {

    return (
      <div className="no-periods-message">
        <p>
          {`\
    Please add at least
    one `}
          <CourseGroupingLabel courseId={this.props.courseId} lowercase={true} />
          {' to the course.\
    '}
        </p>
        {this.props.button || React.createElement(this.AddButton, null)}
      </div>
    );
  }
}

export default NoPeriods;
