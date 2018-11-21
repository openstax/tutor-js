import { React, observer, cn, action } from '../../helpers/react';
import { Dropdown } from 'react-bootstrap';
import { map, partial } from 'lodash';
import { autobind } from 'core-decorators';
import Router from '../../helpers/router';
import CourseGroupingLabel from '../../components/course-grouping-label';

export default class CourseAddMenu {

  constructor(options = {}) {
    this.options = options;
  }

  @autobind goToBuilder(link, key, ev) {
    this.options.router.history.push(link);
    ev.preventDefault();
  }

  render({ course, hasPeriods, date, dateFormat = 'YYYY-MM-DD' } = {}) {
    let links;

    const due_at = date && date.format(dateFormat);
    if (hasPeriods) {
      links = [
        {
          text: 'Add Reading',
          to: 'editReading',
          params: { courseId: course.id, id: 'new' },
          type: 'reading',
          query: { due_at },
        }, {
          text: 'Add Homework',
          to: 'editHomework',
          params: { courseId: course.id, id: 'new' },
          type: 'homework',
          query: { due_at },
        }, {
          text: 'Add External Assignment',
          to: 'editExternal',
          params: { courseId: course.id, id: 'new' },
          type: 'external',
          query: { due_at },
        }, {
          text: 'Add Event',
          to: 'editEvent',
          params: { courseId: course.id, id: 'new' },
          type: 'event',
          query: { due_at },
        },
      ];
    } else {
      const linkText = [
        <span key="no-periods-link-1">Please add a </span>,
        <CourseGroupingLabel key="no-periods-link-2" lowercase={true} courseId={course.id} />,
        <span key="no-periods-link-3"> in </span>,
        <br key="no-periods-link-4" />,
        <span className="no-periods-course-settings-link" key="no-periods-link-5">
          Course Settings
        </span>,
        <span key="no-periods-link-6"> before </span>,
        <br key="no-periods-link-7" />,
        <span key="no-periods-link-8">adding assignments.</span>,
      ];

      links = [{
        text: linkText,
        to: `/course/${course.id}/settings`,
        type: 'none',
        query: {},
      }];
    }

    const renderLink = this.options.renderMenuLink || this.renderMenuLink;

    return map(links, (link) => {
      let linkQuery;
      const { query } = link;
      if (query.due_at != null) { linkQuery = { query }; }

      link.pathname = Router.makePathname(link.to, link.params, linkQuery);
      return renderLink(link, this.goToBuilder);
    });

  }

  @autobind renderMenuLink(link, goToBuilder) {
    return (
      <Dropdown.Item
        className="dropdown-item"
        key={link.type}
        data-assignment-type={link.type}
        onSelect={partial(goToBuilder, link.pathname)}
      >
        {link.text}
      </Dropdown.Item>

    );
  }

}
