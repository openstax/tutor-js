import PropTypes from 'prop-types';
import { React, observer, action, computed, idType, cn } from 'vendor';
import Course from '../../models/course';
import Router from '../../helpers/router';
import ChapterSection from '../../models/chapter-section';

@observer
export default
class extends React.Component {
  static displayName = 'BrowseTheBook';

  static contextTypes = {
      courseId: PropTypes.string,
  };

  static propTypes = {
      course:         PropTypes.instanceOf(Course).isRequired,
      chapterSection: PropTypes.instanceOf(ChapterSection),
      page:           PropTypes.shape({
          id: idType,
      }),
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

  @computed get routeName() {
      const { props } = this;
      if (props.chapterSection) {
          return 'viewReferenceBookSection';
      }
      if (props.page) {
          return 'viewReferenceBookPage';
      }
      return 'viewReferenceBook';
  }

  @computed get href() {
      const { course, page, chapterSection } = this.props;
      return Router.makePathname(this.routeName, {
          courseId: course.id,
          pageId: page ? page.id : null,
          chapterSection: chapterSection ? chapterSection.key : null,
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
          chapterSection, page, windowImpl, course, onClick, // eslint-disable-line no-unused-vars
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
          <Tag data-test-id="browse-the-book-btn" aria-label="Browse course reference book" onClick={this.onClick} {...tagProps}>
              {children}
          </Tag>
      );
  }
}
