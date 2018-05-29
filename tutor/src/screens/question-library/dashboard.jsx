import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import Course from '../../models/course';
import Exercises, { ExercisesMap } from '../../models/exercises';
import SectionsChooser from './sections-chooser';
import ExercisesDisplay from './exercises-display';

@observer
class QuestionsDashboard extends React.Component {
  static propTypes = {
    course: React.PropTypes.instanceOf(Course).isRequired,
    exercises: React.PropTypes.instanceOf(ExercisesMap),
  };

  static defaultProps = {
    exercises: Exercises,
  }

  @observable showingSections = true;
  @observable showingDetails = false;
  @observable focusedExercise = false;
  @observable chapterIds;
  @observable pageIds = [];

  @action.bound onShowDetailsViewClick() {
    this.showingDetails = true;
  }

  @action.bound onShowCardViewClick() {
    this.showingDetails = false;
  }

  @action.bound onSelectionsChange(pageIds) {
    this.pageIds = pageIds;
    this.showingSections = false;
  }

  @action.bound onShowSections() {
    this.showingSections = true;

  }

  render() {
    const { exercises } = this.props;
    const classes = classnames( 'questions-dashboard', { 'is-showing-details': this.focusedExercise } );
    return (
      <div className={classes}>
        <SectionsChooser
          {...this.props}
          isHidden={!this.showingSections}
          onSelectionsChange={this.onSelectionsChange}
        />
        <ExercisesDisplay
          {...this.props}
          onSectionsDisplay={this.onShowSections}
          isHidden={this.showingSections}
          showingDetails={this.showingDetails}
          onShowCardViewClick={this.onShowCardViewClick}
          onShowDetailsViewClick={this.onShowDetailsViewClick}
          pageIds={this.pageIds} />
      </div>
    );
  }
}

export default QuestionsDashboard;
