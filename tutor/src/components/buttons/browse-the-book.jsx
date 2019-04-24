import PropTypes from 'prop-types';
import { React, observer, action, computed, cn } from '../../helpers/react';
import Course from '../../models/course';
import ChapterSection from '../../models/chapter-section';
import Router from '../../helpers/router';

export default
@observer
class extends React.Component {
  static displayName = 'BrowseTheBook';

  static contextTypes = {
    courseId: PropTypes.string,
  };

  static propTypes = {
    course:         PropTypes.instanceOf(Course).isRequired,
    chapterSection: PropTypes.instanceOf(ChapterSection),
    unstyled:       PropTypes.bool,
    tag:            PropTypes.string,
    tabIndex:       PropTypes.number,
    onClick:        PropTypes.func,
    children:       PropTypes.node,
    className:      PropTypes.string,
    windowImpl:     PropTypes.shape({ open: PropTypes.func }),
  };

  static defaultProps = {
    tag: 'a',
    windowImpl: window,
    children: 'Browse the Book',
  }

  @computed get href() {
    const { course, chapterSection } = this.props;
    return Router.makePathname(
      chapterSection ? 'viewReferenceBookSection' : 'viewReferenceBook',
      {
        courseId: course.id,
        chapterSection: chapterSection ? chapterSection.asString : null,
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
      windowImpl, course, chapterSection, onClick, // eslint-disable-line no-unused-vars
      ...tagProps
    } = this.props;

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
}
