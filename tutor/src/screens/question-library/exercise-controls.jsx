import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { keys, first } from 'lodash';
import { Button, ButtonGroup } from 'react-bootstrap';
import classNames from 'classnames';
import Course from '../../models/course';
import TourAnchor from '../../components/tours/anchor';


@observer
export default class ExerciseControls extends React.Component {
  static propTypes = {
    course: React.PropTypes.instanceOf(Course).isRequired,
    onSectionsDisplay: React.PropTypes.func.isRequired,
    exercises: React.PropTypes.shape({
      all: React.PropTypes.object,
      homework: React.PropTypes.object,
      reading: React.PropTypes.object,
    }).isRequired,

    selectedExercises: React.PropTypes.array,
    filter: React.PropTypes.string,
    onFilterChange: React.PropTypes.func.isRequired,
    sectionizerProps:  React.PropTypes.object,
    onShowDetailsViewClick: React.PropTypes.func.isRequired,
    onShowCardViewClick: React.PropTypes.func.isRequired,
  };

  static defaultProps = { sectionizerProps: {} };

  state = {
    hasSaved: false,
  };

  scrollingTargetDOM = () => { return this.props.windowImpl.document; };

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
    const { course, onSectionsDisplay } = this.props;
    const sections = this.getSections();

    const selected = this.props.selectedSection || first(sections);

    const filters =
      <TourAnchor id="exercise-type-toggle">
        <ButtonGroup className="filters">
          <Button
            data-filter="reading"
            onClick={this.onFilterClick}
            className={classNames('reading', { 'active': this.props.filter === 'reading' })}
          >
            Reading
          </Button>
          <Button
            data-filter="homework"
            onClick={this.onFilterClick}
            className={classNames('homework', { 'active': this.props.filter === 'homework' })}
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
        <Button onClick={onSectionsDisplay}>
          + Select more sections
        </Button>
      </div>
    );
  }
}
