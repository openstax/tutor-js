import PropTypes from 'prop-types';
import React from 'react';
import { isEmpty } from 'lodash';
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
      course: PropTypes.instanceOf(Course).isRequired,
      exercises: PropTypes.instanceOf(ExercisesMap),
  };

  static defaultProps = {
      exercises: Exercises,
  }

  @observable isShowingExercises = false;
  @observable showingDetails = false;
  @observable focusedExercise = false;
  @observable chapterIds;
  @observable pageIds = [];

  constructor(props) {
      super(props)

      if (localStorage['ql-pageIds']) {
          this.pageIds = JSON.parse(localStorage['ql-pageIds']);

          if (!isEmpty(this.pageIds) && localStorage['ql-showing-exercises'] === 'true') {
              this.isShowingExercises = true;
              this.props.exercises.fetch({
                  limit: false,
                  course: this.props.course,
                  page_ids: this.pageIds,
              });
          }
      }
  }

  @action.bound onShowDetailsViewClick() {
      this.showingDetails = true;
  }

  @action.bound onShowCardViewClick() {
      this.showingDetails = false;
  }

  @action.bound onSelectionsChange(pageIds) {
      this.pageIds = pageIds;
      this.isShowingExercises = !isEmpty(pageIds);
      localStorage['ql-pageIds'] = JSON.stringify(pageIds);
      localStorage['ql-showing-exercises'] = !isEmpty(pageIds);
  }

  @action.bound onSelectSections() {
      this.showingDetails = false;
      this.isShowingExercises = false;
      localStorage['ql-showing-exercises'] = false;
  }

  render() {
      const classes = classnames( 'questions-dashboard', { 'is-showing-details': this.focusedExercise } );
      return (
          <div className={classes}>
              {!this.isShowingExercises && (
                  <SectionsChooser
                      {...this.props}
                      pageIds={this.pageIds}
                      onSelectionsChange={this.onSelectionsChange}
                  />
              )}
              {this.isShowingExercises && (
                  <ExercisesDisplay
                      {...this.props}
                      onSelectSections={this.onSelectSections}
                      showingDetails={this.showingDetails}
                      onShowCardViewClick={this.onShowCardViewClick}
                      onShowDetailsViewClick={this.onShowDetailsViewClick}
                      pageIds={this.pageIds} />
              )}
          </div>
      );
  }
}

export default QuestionsDashboard;
