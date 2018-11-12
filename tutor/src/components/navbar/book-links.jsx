import PropTypes from 'prop-types';
import React from 'react';

import TutorLink from '../link';
import { get } from 'lodash';
import Courses from '../../models/courses-map';
import { Icon } from 'shared';

export default class BookLinks extends React.Component {

  static propTypes = {
    courseId: PropTypes.string,
  }

  render() {
    const course = Courses.get(this.props.courseId);
    if (!get(course, 'is_concept_coach')) { return null; }

    const links = [];
    if (course.book_pdf_url) {
      links.push(
        <a key="pdf" target="_blank" href={course.book_pdf_url}>
          Homework PDF
        </a>
      );
    }
    if (course.webview_url) {
      links.push(
        <a key="webview" target="_blank" href={course.webview_url}>
          <span>Online Book</span>
          <Icon type="external-link" />
        </a>
      );
    }

    return (
      <div className="book-links">
        {links}
        <TutorLink
          key="assignment"
          to="viewAssignmentLinks"
          activeClassName="active"
          params={{ courseId: this.props.courseId }}
        >
          Assignment Links
        </TutorLink>
      </div>
    );

  }
}
