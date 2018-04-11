import { React, observer, cn, action } from '../../helpers/react';
import { map } from 'lodash';
import { autobind } from 'core-decorators';
import Router from '../../helpers/router';
import CourseGroupingLabel from '../../components/course-grouping-label';

export default class CourseAddMenu {

  constructor(options = {}) {
    this.options = options;
  }

  @autobind goToBuilder(link) {
    return (clickEvent) => {
      clickEvent.preventDefault();
      this.options.router.history.push(link.pathname);
    };
  }

  render(props, { addDate } = {}) {
    let links;
    const { course, hasPeriods, dateFormat = 'YYYY-MM-DD' } = props;
    const due_at = addDate && addDate.format(dateFormat);
    if (hasPeriods) {
      links = [
        {
          text: 'Add Reading',
          to: 'createReading',
          params: { courseId: course.id },
          type: 'reading',
          query: { due_at },
        }, {
          text: 'Add Homework',
          to: 'createHomework',
          params: { courseId: course.id },
          type: 'homework',
          query: { due_at },
        }, {
          text: 'Add External Assignment',
          to: 'createExternal',
          params: { courseId: course.id },
          type: 'external',
          query: { due_at },
        }, {
          text: 'Add Event',
          to: 'createEvent',
          params: { courseId: course.id },
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
      var linkQuery;
      const { query } = link;
      if (query.due_at != null) { linkQuery = {query}; }

      link.pathname = Router.makePathname(link.to, link.params, linkQuery);
      return renderLink(link, this.goToBuilder);
    });

  }

  @autobind renderMenuLink(link, goToBuilder) {
    return (
      <li key={link.type} data-assignment-type={link.type} ref={`${link.type}Link`}>
        <a href={link.pathname} onClick={goToBuilder(link)}>
          {link.text}
        </a>
      </li>
    );
  }

}
