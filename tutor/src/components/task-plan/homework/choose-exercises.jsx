import React from 'react';
import { isEmpty } from 'lodash';
import { Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { TaskPlanStore } from '../../../flux/task-plan';
import AddExercises from './add-exercises';
import ScrollTo from '../../../helpers/scroll-to';
import Loading from '../../loading-screen';
import SelectTopics from '../select-topics';
import Exercises, { ExercisesMap } from '../../../models/exercises';
import CourseModel from '../../../models/course';

@observer
class ChooseExercises extends React.Component {

  static propTypes = {
    course:      React.PropTypes.instanceOf(CourseModel).isRequired,
    exercises:   React.PropTypes.instanceOf(ExercisesMap),
    planId:      React.PropTypes.string.isRequired,
    hide:        React.PropTypes.func.isRequired,
    cancel:      React.PropTypes.func.isRequired,
    canEdit:     React.PropTypes.bool,
    windowImpl:  React.PropTypes.object,
  };

  static defaultProps = {
    exercises: Exercises,
  }

  @observable showProblems = false;
  @observable selectedPageIds = TaskPlanStore.getTopics(this.props.planId);

  scroller = new ScrollTo({ windowImpl: this.props.windowImpl });

  @action.bound selectProblems() {
    this.props.exercises.fetch({ book: this.props.course.referenceBook, page_ids: this.selectedPageIds });
    this.scroller.scrollToSelector('.select-topics .panel-footer'); // move down so loader shows
    this.showProblems = true;
  }

  @action.bound onAddClick() {
    this.showProblems = false;
    this.scroller.scrollToSelector('.select-topics');
  }

  @action.bound onSectionChange(pageIds) {
    this.selectedPageIds = pageIds;
    this.showProblems = false;
  }

  renderExercises() {
    const { course, exercises, planId, hide, cancel } = this.props;
    if (!this.selectedPageIds.length || !this.showProblems) { return null; }
    if (exercises.isFetching({ pageIds: this.selectedPageIds })) { return <Loading />; }

    return (
      <AddExercises
        course={course}
        exercises={exercises}
        hide={hide}
        cancel={cancel}
        canEdit={true}
        canAdd={true}
        onAddClick={this.onAddClick}
        courseId={course.id}
        planId={planId}
        pageIds={this.selectedPageIds} />
    );
  }

  renderSectionsChooser() {
    const { course, planId, hide, cancel } = this.props;
    if (this.showProblems) {
      return null;
    }
    return (
      <SelectTopics
        primary={
          <Button
            className="show-problems"
                       bsStyle="primary"
                       disabled={isEmpty(this.selectedPageIds)}
            onClick={this.selectProblems}
                       key="show-problems" // need key because button is passed in and rendered in array
            >
            Show Problems
          </Button>
        }
        onSectionChange={this.onSectionChange}
        header="Add Questions"
        type="homework"
        course={course}
        planId={planId}
        cancel={cancel}
        hide={hide}
      />
    );
  }

  render() {

    return (
      <div className="homework-plan-exercise-select-topics">
        {this.renderSectionsChooser()}
        {this.renderExercises()}
      </div>
    );
  }
}

export default ChooseExercises;
