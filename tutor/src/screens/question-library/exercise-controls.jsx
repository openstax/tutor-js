import { React, PropTypes, observer, styled } from 'vendor';
import { Formik } from 'formik';
import { keys } from 'lodash';
import { Button, Popover, OverlayTrigger } from 'react-bootstrap';
import Course from '../../models/course';
import TourAnchor from '../../components/tours/anchor';
import ScrollSpy from '../../components/scroll-spy';
import Sectionizer from '../../components/exercises/sectionizer';
import RadioInput from '../../components/radio-input';
import { colors } from 'theme';
import { Icon } from 'shared';

const StyledExerciseControls = styled.div`
  .exercise-controls-bar {
    height: 65px;
    border-bottom: 1px solid ${colors.neutral.pale};
    justify-content: flex-start;
  }
  // sections
  .exercise-controls-bar:first-child {
    overflow-x: auto;
    // hack to add 'margin' when div is overflowed
    border-right: 1.1rem solid transparent;
    border-left: 1.1rem solid transparent;
    .sectionizer {
      margin: 0 1.7rem;
    }
    .back-to-section {
      padding: 0;
      min-width: 8rem;
      svg {
        margin-right: 0.5rem;
        margin-left: 0;
      }
    }
  }
  // filters and create question button
  .exercise-controls-bar:nth-child(2) {
    padding: 0 3.2rem;
    .library-label {
      font-weight: 700;
      color: ${colors.neutral.grayblue};
    }
    .filters-wrapper {
      margin-left: 2.3rem;
      label {
        margin-bottom: 0;
      }
      span+span {
        margin-left: 3.3rem;
      }
    }
  }
`;

const StyledPopover = styled(Popover)`
  padding: 1.5rem;
  color: ${colors.neutral.darker};
`;

@observer
class ExerciseControls extends React.Component {
  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
    onSelectSections: PropTypes.func.isRequired,
    exercises: PropTypes.shape({
      all: PropTypes.object,
      homework: PropTypes.object,
      reading: PropTypes.object,
    }).isRequired,
    selectedExercises: PropTypes.array,
    filter: PropTypes.string,
    onFilterChange: PropTypes.func.isRequired,
    sectionizerProps:  PropTypes.object,
    onShowDetailsViewClick: PropTypes.func.isRequired,
    onShowCardViewClick: PropTypes.func.isRequired,
    displayedChapterSections: PropTypes.array,
    showingDetails: PropTypes.bool,
    topScrollOffset: PropTypes.number,
  };

  getSections = () => {
    return (
      keys(this.props.exercises.all.grouped)
    );
  };

  onFilterClick = (ev) => {
    let filter = ev.currentTarget.getAttribute('data-filter');
    if (filter === this.props.filter) { filter = ''; }
    return (
      this.props.onFilterChange( filter )
    );
  };

  render() { 
    const { course, displayedChapterSections, showingDetails, filter, topScrollOffset } = this.props;

    let sectionizerProps;

    if (showingDetails) {
      sectionizerProps = {
        currentSection: this.currentSection,
        onSectionClick: this.setCurrentSection,
      };
    }

    const libraryPopover =
      <StyledPopover>
        OpenStax Tutor has two main assignment types: Reading and Homework,
        and offers different question libraries for each type.
      </StyledPopover>;

    const sections =
      <div className="exercise-controls-bar">
        <Button className="back-to-section" variant="link" onClick={this.props.onSelectSections}>
          <Icon
            size="lg"
            type="angle-left"
          />
        Sections
        </Button>
        <ScrollSpy dataSelector="data-section">
          <Sectionizer
            ref="sectionizer"
            {...sectionizerProps}
            fullWidth
            onScreenElements={[]}
            chapter_sections={displayedChapterSections}
            topScrollOffset={topScrollOffset}
          />
        </ScrollSpy>
      </div>;

    const filters =
      <TourAnchor id="exercise-type-toggle">
        <RadioInput
          name="filter-assignment-type"
          value="homework"
          label="Homework questions"
          labelSize="lg"
          data-filter="homework"
          checked={filter === 'homework'}
          onChange={this.onFilterClick}
        />
        <RadioInput
          name="filter-assignment-type"
          value="reading"
          label="Reading questions"
          labelSize="lg"
          data-filter="reading"
          checked={filter === 'reading'}
          onChange={this.onFilterClick}
        />
      </TourAnchor>;

    return (
      <StyledExerciseControls>
        { displayedChapterSections.length > 0 && sections }
        <Formik>
          <div className="exercise-controls-bar">
            <OverlayTrigger placement="bottom" overlay={libraryPopover}>
              <span className="library-label">Library</span>
            </OverlayTrigger>
            <div className="filters-wrapper">
              {!course.is_concept_coach ? filters : undefined}
            </div>
          </div>
        </Formik>
      </StyledExerciseControls>
    );
  }
}

export default ExerciseControls;
