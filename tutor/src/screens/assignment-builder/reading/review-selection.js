import { React, PropTypes, observer } from '../../../helpers/react';
import { map } from 'lodash';
import UX from '../ux';
import TourRegion from '../../../components/tours/region';


@observer
class Section extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
  }

  // static propTypes = {
  //   page: PropTypes.instanceOf(Page).isRequired,
  //   index: PropTypes.number.isRequired,
  //   planId: PropTypes.string.isRequired,
  //   topicId: PropTypes.string.isRequired,
  //   canEdit: PropTypes.bool,
  // };

  getActionButtons = () => {
    let moveUpButton;
    if (this.props.index) {
      moveUpButton = (
        <Icon onClick={this.moveReadingUp} size="xs" type="arrow-up" />
      );
    }

    if (this.props.canEdit) {
      return (
        <span className="section-buttons">
          {moveUpButton}
          <Icon onClick={this.moveReadingDown} size="xs" type="arrow-down" />
          <Icon onClick={this.removeTopic} type="close" />
        </span>
      );
    }
    return null;
  };

  moveReadingDown = () => {
    return TaskPlanActions.moveReading(this.props.planId, this.props.topicId, 1);
  };

  moveReadingUp = () => {
    return TaskPlanActions.moveReading(this.props.planId, this.props.topicId, -1);
  };

  removeTopic = () => {
    return TaskPlanActions.removeTopic(this.props.planId, this.props.topicId);
  };

  render() {
    const { page } = this.props;
    if (!page) { return null; }
    const cs = new ChapterSectionModel(page.chapter_section);
    const actionButtons = this.getActionButtons();
    return (
      <li className="selected-section">
        <ChapterSection chapterSection={cs} />
        <span className="section-title">
          {page.title}
        </span>
        {actionButtons}
      </li>
    );
  }
}


export default
@observer
class ReviewSelection extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    // courseId: PropTypes.string.isRequired,
    // planId: PropTypes.string.isRequired,
    // selected: PropTypes.array,
    // canEdit: PropTypes.bool,
  };

  static defaultProps = {
    selected: [],
  }

  // UNSAFE_componentWillMount() {
  //   this.book = Courses.get(this.props.courseId).referenceBook;
  //   return this.book.ensureLoaded();
  // }

  renderSection = (pageId, index) => {
    return (
      <Section
        ux={this.props.ux}
        pageId={pageId}
        index={index}
        key={`review-reading-${index}`}
      />
    );
  };

  render() {
    const { ux } = this.props;

    if (ux.referenceBook.api.isPending) { return null; } // no loading indicator

    if (ux.selectedPageIds.length) {
      return (
        <TourRegion
          tag="ul"
          delay={4000}
          className="selected-reading-list"
          id="add-reading-review-sections"
          courseId={ux.course.id}
        >
          <li>
            Currently selected
          </li>
          {map(ux.selectedPageIds, this.renderSection)}
        </TourRegion>
      );
    } else {
      return <div className="-selected-reading-list-none" />;
    }
  }
}
