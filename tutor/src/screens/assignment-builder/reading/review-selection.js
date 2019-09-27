import { React, PropTypes, observer, action } from 'vendor';
import { Icon } from 'shared';
import UX from '../ux';
import TourRegion from '../../../components/tours/region';
import ChapterSection from '../../../components/chapter-section';

@observer
class ReadingSection extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    page: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
  }

  getActionButtons = () => {
    const { ux, index } = this.props;
    if (!ux.canEdit) { return null; }

    return (
      <span className="section-buttons">
        {index !== 0 &&
          <Icon onClick={this.moveUp} size="xs" type="arrow-up" />}
        {index+1 !== ux.selectedPages.length &&
          <Icon onClick={this.moveDown} size="xs" type="arrow-down" />}
        <Icon onClick={this.remove} type="close" />
      </span>
    );
  };

  @action.bound moveDown() {
    this.props.ux.plan.movePage(this.props.page, 1);
  }

  @action.bound moveUp() {
    this.props.ux.plan.movePage(this.props.page, -1);
  }

  @action.bound remove() {
    this.props.ux.plan.removePage(this.props.page);
  }

  render() {
    const { page } = this.props;

    const actionButtons = this.getActionButtons();
    return (
      <li className="selected-section">
        <ChapterSection chapterSection={page.chapter_section} />
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
  };

  static defaultProps = {
    selected: [],
  }

  render() {
    const { ux } = this.props;

    if (!ux.selectedPages.length) {
      return <div className="-selected-reading-list-none" />;
    }

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
        {ux.selectedPages.map((page, index) =>
          <ReadingSection
            ux={this.props.ux}
            page={page}
            index={index}
            key={page.id}
          />)}
      </TourRegion>
    );
  }
}
