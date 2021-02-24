import PropTypes from 'prop-types';
import React from 'react';

import { observer } from 'mobx-react';
import { computed } from 'mobx';

import Courses from '../models/courses-map';
import CourseUX from '../models/course/ux';

@observer
export default
class CourseTitleBanner extends React.Component {

  static propTypes = {
      courseId: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
      ]).isRequired,
  }

  @computed get course () {
      return Courses.get(this.props.courseId);
  }

  @computed get ux () {
      return new CourseUX(this.course);
  }

  render() {
      return (
          <div
              className="course-title-banner"
              {...this.ux.dataProps}
          >
              <div className='book-title'>
                  <h1 className='book-title-text'>{this.ux.dataProps['data-title']}</h1>
              </div>
              <div className='course-term'>
                  {this.course.termFull}
              </div>
          </div>
      );
  }
}
