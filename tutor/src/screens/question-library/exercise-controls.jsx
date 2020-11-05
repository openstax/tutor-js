import {
  React, PropTypes, observer, autobind, cn, styled,
} from 'vendor';
import { keys } from 'lodash';
import { Button, ButtonGroup } from 'react-bootstrap';
import Course from '../../models/course';
import TourAnchor from '../../components/tours/anchor';
import ScrollSpy from '../../components/scroll-spy';
import Sectionizer from '../../components/exercises/sectionizer';
import { colors } from 'theme';
import { Icon } from 'shared';

const StyledExerciseControls = styled.div`
  // sections
  .exercise-controls-bar:first-child {
    height: 70px;
    border-bottom: 1px solid ${colors.neutral.pale};
    overflow-x: auto;
    justify-content: flex-start;
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
`;

@observer
class ExerciseControls extends React.Component {
  static propTypes = {
    course:      PropTypes.instanceOf(Course).isRequired,
    onSelectSections: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
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
    const { course, displayedChapterSections, showingDetails } = this.props;

    let sectionizerProps;

    if (showingDetails) {
      sectionizerProps = {
        currentSection: this.currentSection,
        onSectionClick: this.setCurrentSection,
      };
    }

    const filters =
      <TourAnchor id="exercise-type-toggle">
        <ButtonGroup className="filters">
          <Button
            variant="default"
            data-filter="reading"
            onClick={this.onFilterClick}
            className={cn('reading', { 'active': this.props.filter === 'reading' })}
          >
            Reading
          </Button>
          <Button
            variant="default"
            data-filter="homework"
            onClick={this.onFilterClick}
            className={cn('homework', { 'active': this.props.filter === 'homework' })}
          >
            Homework
          </Button>
        </ButtonGroup>
      </TourAnchor>;

    return (
      <StyledExerciseControls>
        {
          displayedChapterSections &&
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
              />
            </ScrollSpy>
          </div>
        }
        <div className="exercise-controls-bar">
          <div className="filters-wrapper">
            {!course.is_concept_coach ? filters : undefined}
          </div>
          <Button onClick={this.props.onSelectSections}>
          + Select more sections
          </Button>
        </div>
      </StyledExerciseControls>
    );
  }

  @autobind renderControls() {
    
  }
}

export default ExerciseControls;
