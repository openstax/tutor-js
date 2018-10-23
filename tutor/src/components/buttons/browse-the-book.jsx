import PropTypes from 'prop-types';
import { React, observer, action, computed, cn } from '../../helpers/react';
import invariant from 'invariant';
import Course from '../../models/course';
import Book from '../../models/reference-book';
import Router from '../../helpers/router';

export default
@observer
class extends React.Component {
  static displayName = 'BrowseTheBook';

  static contextTypes = {
    courseId: PropTypes.string,
  };

  static propTypes = {
    book:           PropTypes.instanceOf(Book),
    course:         PropTypes.instanceOf(Course),
    unstyled:       PropTypes.bool,
    tag:            PropTypes.string,
    tabIndex:       PropTypes.number,
    onClick:        PropTypes.func,
    children:       PropTypes.node,
    className:      PropTypes.string,
    windowImpl:     PropTypes.shape({ open: PropTypes.func }),
    chapterSection: PropTypes.string,
  };

  static defaultProps = {
    tag: 'a',
    windowImpl: window,
    children: 'Browse the Book',
  }

  @computed get href() {
    const { course, book, chapterSection } = this.props;
    return Router.makePathname(
      chapterSection ? 'viewReferenceBookSection' : 'viewReferenceBook',
      {
        chapterSection,
        ecosystemId: book ? book.id : course.ecosystem_id,
      }
    );
  }

  @action.bound onClick(ev) {
    if (this.props.tag !== 'a') {
      this.props.windowImpl.open(this.href);
    }
    if (this.props.onClick) { this.props.onClick(ev); }
  }

  render() {
    const { tag: Tag, children, className, unstyled,
      windowImpl, course, book, chapterSection, onClick, // eslint-disable-line no-unused-vars
      ...tagProps
    } = this.props;
    invariant(book || course, 'browse the book requires either a course or book');

    Object.assign(tagProps, ('a' === Tag) ? {
      href: this.href, target: '_blank',
    } : {
      'role': 'link',
    });
    tagProps.className = cn('browse-the-book', className, {
      'btn btn-default': !unstyled,
    });

    return (
      <Tag aria-label="Browse course reference book" onClick={this.onClick} {...tagProps}>
        {children}
      </Tag>
    );
  }
};
