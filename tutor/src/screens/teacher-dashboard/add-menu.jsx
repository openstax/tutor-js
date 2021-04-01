import { React } from 'vendor';
import { Dropdown } from 'react-bootstrap';
import { map, partial } from 'lodash';
import styled from 'styled-components';
import { autobind } from 'core-decorators';
import Router from '../../helpers/router';
import CourseGroupingLabel from '../../components/course-grouping-label';
import { colors } from 'theme';
import S from '../../helpers/string';

const StyledMenuContainer = styled.div`
  & hr {
    margin: 0.5rem 1rem;
    border-top: 2px solid ${colors.neutral.pale};
  }
  /* Overriding the color from 'tutor-plan-sidebar-type' */
  && a[data-assignment-type='template'] {
    color: ${colors.link};
  }
`;

export default class CourseAddMenu {

    constructor(options = {}) {
        this.options = options;
    }

    @autobind goToBuilder(link, key, ev) {
        this.options.history.push(link);
        ev.preventDefault();
    }

    render({ course, hasPeriods, date, dateFormat = 'YYYY-MM-DD' } = {}) {
        let links;

        const due_at = date && date.format(dateFormat);
        if (hasPeriods) {
            links = [
                {
                    text: `Add ${S.assignmentHeaderText('reading')}`,
                    to: 'editAssignment',
                    params: { type: 'reading', courseId: course.id, id: 'new' },
                    type: 'reading',
                    query: { due_at },
                }, {
                    text: `Add ${S.assignmentHeaderText('homework')}`,
                    to: 'editAssignment',
                    params: { type: 'homework', courseId: course.id, id: 'new' },
                    type: 'homework',
                    query: { due_at },
                }, {
                    text: `Add ${S.assignmentHeaderText('external')}`,
                    to: 'editAssignment',
                    params: { type: 'external', courseId: course.id, id: 'new' },
                    type: 'external',
                    query: { due_at },
                }, {
                    text: `Add ${S.assignmentHeaderText('event')}`,
                    to: 'editAssignment',
                    params: { type: 'event', courseId: course.id, id: 'new' },
                    type: 'event',
                    query: { due_at },
                }, 
            ];
            if (!this.options.isSidebar) {
                links.push(
                    {
                        text: 'Grading Templates',
                        to: 'gradingTemplates',
                        params: { courseId: course.id },
                        type: 'template',
                        query: {},
                    },
                );
            }
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

        return (
            <StyledMenuContainer>
                {
                    map(links, (link, index) => {
                        let linkQuery;
                        const { query } = link;
                        if (query.due_at != null) { linkQuery = { query }; }

                        link.pathname = Router.makePathname(link.to, link.params, linkQuery);
                        // Add divider on the second to last item
                        return renderLink(link, this.goToBuilder, index === links.length - 2);
                    })
                }
            </StyledMenuContainer>
        );

    }

    @autobind renderMenuLink(link, goToBuilder, shouldAddDivider) {
        return (
            <div key={link.type}>
                <Dropdown.Item
                    className="dropdown-item"

                    data-assignment-type={link.type}
                    onSelect={partial(goToBuilder, link.pathname)}
                >
                    {link.text}
                </Dropdown.Item>
                {shouldAddDivider && <hr></hr>}
            </div>
        );
    }

}
