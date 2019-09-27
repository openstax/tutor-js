import {
  React, PropTypes, observer, inject, autobind, cn,
} from 'vendor';
import { keys } from 'lodash';
import { Button, ButtonGroup } from 'react-bootstrap';

import Course from '../../models/course';
import TourAnchor from '../../components/tours/anchor';

@inject('setSecondaryTopControls')
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
    setSecondaryTopControls: PropTypes.func.isRequired,
  };

  static defaultProps = { sectionizerProps: {} };

  constructor(props) {
    super(props);
    props.setSecondaryTopControls(this.renderControls);
  }

  componentWillUnmount() {
    this.props.setSecondaryTopControls(null);
  }

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

  render() { return null; }

  @autobind renderControls() {
    const { course } = this.props;

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
      <div className="exercise-controls-bar">
        {this.props.children}
        <div className="filters-wrapper">
          {!course.is_concept_coach ? filters : undefined}
        </div>
        <Button onClick={this.props.onSelectSections}>
          + Select more sections
        </Button>
      </div>
    );
  }
}

export default ExerciseControls;
