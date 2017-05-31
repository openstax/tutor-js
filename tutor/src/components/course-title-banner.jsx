import React from 'react';

import { observer } from 'mobx-react';
import { computed, action } from 'mobx';

import Courses from '../models/courses-map';
import CourseUX from '../models/course/ux';

@observer
export default class CourseTitleBanner extends React.PureComponent {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired
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
          <span className='book-title-text'>{this.ux.dataProps['data-title']}</span>
        </div>
        <div className='course-term'>
          {this.course.termFull}
        </div>
      </div>
    )
  }
}
