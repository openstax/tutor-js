import { React, PropTypes, styled, observer, action } from 'vendor';
import { colors } from 'theme';
import { Icon } from 'shared';
import TourRegion from '../../components/tours/region';
import BookPartTitle from '../../components/book-part-title';
import { AssignmentBuilder } from './builder';

const SectionsList = styled.ul`
  list-style: none;
  padding-left: 0;
  padding: 4rem;


  li {
    border-bottom: 1px solid ${colors.neutral.lighter};
    margin: 1rem;
    padding-bottom: 1rem;

    display: flex;
    align-items: center;

    .section-title { flex: 1; }

    &:first-child {
      font-size: 2rem;
      margin-bottom: 2rem;
    }

    > span:first-child {
      margin-right: 5px;
    }
  }

  li:last-child .section-buttons .arrow-down {
    display: none;
  }
`;

@observer
class ReadingSection extends React.Component {

  static propTypes = {
    ux: PropTypes.object.isRequired,
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
        <BookPartTitle className="section-title" part={page} displayChapterSection />
        {actionButtons}
      </li>
    );
  }
}


export default
@observer
class ReviewSelection extends React.Component {

  static propTypes = {
    ux: PropTypes.object.isRequired,
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
        delay={4000}
        className="selected-reading-list"
        id="add-reading-review-sections"
        courseId={ux.course.id}
      >
        <AssignmentBuilder
          title="Review"
          ux={ux}
        >
          <SectionsList>
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
          </SectionsList>
        </AssignmentBuilder>
      </TourRegion>
    );
  }
}
