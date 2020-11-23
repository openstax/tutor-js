import { React, PropTypes, observer, styled, inject, autobind } from 'vendor';
import { Button, Popover, OverlayTrigger } from 'react-bootstrap';
import { partial } from 'lodash';
import Course from '../../models/course';
import TourAnchor from '../../components/tours/anchor';
import ScrollSpy from '../../components/scroll-spy';
import Sectionizer from '../../components/exercises/sectionizer';
import RadioInput from '../../components/radio-input';
import HomeExerciseFilters from '../../components/exercises/homework-exercise-filters';
import CourseBreadcrumb from '../../components/course-breadcrumb';
import { ExercisesMap } from '../../models/exercises';
import { colors } from 'theme';
import { Icon } from 'shared';

const StyledExerciseControls = styled.div`
  .exercise-controls-bar {
    display: flex;
    height: 60px;
    border-top: 1px solid ${colors.neutral.pale};
    label {
      font-size: 1.4rem;
    }
  }
  .sections-control {
    justify-content: flex-start;
    overflow-x: auto;
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
  .filters-control {
    border-bottom: 1px solid ${colors.neutral.pale};
    justify-content: space-between;
    padding: 0 2.2rem;
    .library-label {
      font-weight: 700;
      color: ${colors.neutral.grayblue};
    }
    .exercise-controls-wrapper {
      display: flex;
      .exercise-filters {
        margin-left: 2.3rem;
        label {
          margin-bottom: 0;
        }
        span+span {
          margin-left: 3.3rem;
        }
      }
    }
    .questions-controls-wrapper {
      display: flex;
      height: 40px;
      .question-filters {
        padding: 1rem 3rem;
      }
      .btn {
        padding: 0 4rem;
      }
    }
  }
`;

const StyledCourseBreadcrumb = styled(CourseBreadcrumb)`
  margin: 0;
  padding: 2rem;
  background-color: white;
  max-width: 100%;
`;

const StyledPopover = styled(Popover)`
  padding: 1.5rem;
  color: ${colors.neutral.darker};
`;

@inject('setSecondaryTopControls')
@observer
class ExerciseControls extends React.Component {
  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
    exercises: PropTypes.instanceOf(ExercisesMap).isRequired,
    onSelectSections: PropTypes.func.isRequired,
    exerciseTypeFilter: PropTypes.string.isRequired,
    onExerciseTypeFilterChange: PropTypes.func.isRequired,
    onFilterHomeworkExercises: PropTypes.func.isRequired,
    displayedChapterSections: PropTypes.array,
    showingDetails: PropTypes.bool,
    topScrollOffset: PropTypes.number,
    setSecondaryTopControls: PropTypes.func.isRequired,
    showAddEditQuestionModal: PropTypes.bool.isRequired,
    onDisplayAddEditQuestionModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    props.setSecondaryTopControls(this.renderControls);
  }

  componentWillUnmount() {
    this.props.setSecondaryTopControls(null);
  }

  onExerciseTypeFilterClick = (ev) => {
    let exerciseTypeFilter = ev.currentTarget.getAttribute('data-exercise-filter');
    if (exerciseTypeFilter === this.props.exerciseTypeFilter) { exerciseTypeFilter = ''; }
    return (
      this.props.onExerciseTypeFilterChange( exerciseTypeFilter )
    );
  };

  @autobind renderControls() {
    const {
      exercises,
      course,
      displayedChapterSections,
      showingDetails,
      exerciseTypeFilter,
      topScrollOffset,
      onFilterHomeworkExercises,
      onDisplayAddEditQuestionModal } = this.props;

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
      <div className="exercise-controls-bar sections-control">
        <Button className="back-to-section" variant="link" onClick={this.props.onSelectSections}>
          <Icon
            size="lg"
            type="angle-left"
          />
        Sections
        </Button>
        {
          displayedChapterSections.length > 0 && 
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
        }
      </div>;

    const exerciseFilters =
      <TourAnchor id="exercise-type-toggle">
        <RadioInput
          name="filter-assignment-type"
          value="homework"
          label="Homework questions"
          labelSize="lg"
          data-exercise-filter="homework"
          checked={exerciseTypeFilter === 'homework'}
          onChange={this.onExerciseTypeFilterClick}
          standalone
        />
        <RadioInput
          name="filter-assignment-type"
          value="reading"
          label="Reading questions"
          labelSize="lg"
          data-exercise-filter="reading"
          checked={exerciseTypeFilter === 'reading'}
          onChange={this.onExerciseTypeFilterClick}
          standalone
        />
      </TourAnchor>;

    return (
      <StyledExerciseControls>
        <StyledCourseBreadcrumb course={course} currentTitle="Question Library" />
        {sections}
        <div className="exercise-controls-bar filters-control">
          <div className="exercise-controls-wrapper">
            <OverlayTrigger placement="bottom" overlay={libraryPopover}>
              <span className="library-label">Library</span>
            </OverlayTrigger>
            <div className="exercise-filters">
              {!course.is_concept_coach ? exerciseFilters : undefined}
            </div>
          </div>
          <div className="questions-controls-wrapper">
            <HomeExerciseFilters
              className="question-filters"
              exercises={exercises}
              exerciseType={exerciseTypeFilter}
              returnFilteredExercises={(ex) => onFilterHomeworkExercises(ex)}/>
            <Button
              variant="primary"
              onClick={partial(onDisplayAddEditQuestionModal, true)}>
              Create question
            </Button>
          </div>    
        </div>
      </StyledExerciseControls>
    );
  }

  render() { return null; }
}

export default ExerciseControls;
