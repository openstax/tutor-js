import { React, observer, action, computed, cn } from '../../helpers/react';
import invariant from 'invariant';
import Course from '../../models/course';
import Book from '../../models/reference-book';
import Router from '../../helpers/router';

@observer
export default class extends React.Component {
  static displayName = 'BrowseTheBook';

  static contextTypes = {
    courseId: React.PropTypes.string,
  };

  static propTypes = {
    book:           React.PropTypes.instanceOf(Book),
    course:         React.PropTypes.instanceOf(Course),
    unstyled:       React.PropTypes.bool,
    tag:            React.PropTypes.string,
    tabIndex:       React.PropTypes.number,
    bsStyle:        React.PropTypes.string,
    onClick:        React.PropTypes.func,
    children:       React.PropTypes.node,
    className:      React.PropTypes.string,
    windowImpl:     React.PropTypes.shape({ open: React.PropTypes.func }),
    chapterSection: React.PropTypes.string,
  };

  static defaultProps = {
    tag: 'a',
    windowImpl: window,
    children: 'Browse the Book',
  }

  @computed get href() {
    const { course, book, chapterSection } = this.props;
    return Router.makePathname('viewReferenceBook', {
      chapterSection,
      ecosystemId: book ? book.id : course.ecosystem_id,
    });
  }

  @action.bound onClick(ev) {
    if (this.props.tag !== 'a') {
      this.props.windowImpl.open(this.href);
    }
    if (this.props.onClick) { this.props.onClick(ev); }
  }

  render() {
    const { tag: Tag, children, className, unstyled,
      windowImpl, course, book, page, onClick, // eslint-disable-line no-unused-vars
      ...tagProps
    } = this.props;
    invariant(book || course, 'browse the book requires either a course or book');

    Object.assign(tagProps, ('a' === Tag) ? {
        href: this.href, target: '_blank',
    } : {
      'aria-role': 'link',
    });
    tagProps.className = cn('browse-the-book', className, {
      'btn btn-default': !unstyled,
    });

    return (
      <Tag onClick={this.onClick} {...tagProps}>
        {children}
      </Tag>
    );
  }
}
