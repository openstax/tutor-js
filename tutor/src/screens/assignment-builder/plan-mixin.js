import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { memoize, extend } from 'lodash';
import Courses from '../../models/courses-map';
import { TaskPlanStore, TaskPlanActions } from '../../flux/task-plan';
import { TaskingStore, TaskingActions } from '../../flux/tasking';
import LoadableItem from '../../components/loadable-item';
import TourRegion from '../../components/tours/region';
import { TimeStore } from '../../flux/time';
import { CloseButton } from 'shared';
import TutorDialog from '../../components/tutor-dialog';
import S from '../../helpers/string';
import Router from '../../helpers/router';
import './styles.scss';

// we should gather things somewhere nice.
const CALENDAR_DATE_FORMAT = 'YYYY-MM-DD';

const PlanMixin = {
  contextTypes: {
    router: PropTypes.object,
  },

  getInitialState() {
    return extend(this.getStates(), { displayValidity: false });
  },

  getCourse() {
    return this.props.course || Courses.get(this.props.courseId);
  },

  getStates() {
    const id = this.props.id || this.props.planId;

    const isPublishedOrPublishing = TaskPlanStore.isPublished(id) || TaskPlanStore.isPublishing(id);
    const isTaskOpened = TaskingStore.isTaskOpened(id);

    const isVisibleToStudents = (isPublishedOrPublishing && isTaskOpened) || false;
    const isEditable = TaskPlanStore.isEditable(id);
    const isSwitchable = !isVisibleToStudents || TaskingStore.hasAllTaskings(id);

    const invalid = !this.isSaveable();

    return { isVisibleToStudents, isEditable, isSwitchable, invalid };
  },

  updateIsVisibleAndIsEditable() {
    return this.setState(this.getStates());
  },

  UNSAFE_componentWillMount() {
    const { id } = this.props;

    TaskPlanStore.on('publish-queued', this.updateIsVisibleAndIsEditable);
    TaskPlanStore.on(`loaded.${id}`, this.updateIsVisibleAndIsEditable);
    TaskPlanStore.on('change', this.updateValidity);
    TaskingStore.on(`taskings.${id}.*.loaded`, this.updateIsVisibleAndIsEditable);
  },

  componentWillUnmount() {
    const { id } = this.props;

    TaskPlanStore.off('publish-queued', this.updateIsVisibleAndIsEditable);
    TaskPlanStore.off(`loaded.${id}`, this.updateIsVisibleAndIsEditable);
    TaskPlanStore.off('change', this.updateValidity);
    TaskingStore.off(`taskings.${id}.*.loaded`, this.updateIsVisibleAndIsEditable);
  },

  showSectionTopics() {
    return this.setState({
      showSectionTopics: true,
      savedTopics: TaskPlanStore.getTopics(this.props.id),
      savedExercises: TaskPlanStore.getExercises(this.props.id),
    });
  },

  cancelSelection() {
    TaskPlanActions.updateTopics(this.props.id, this.state.savedTopics);
    TaskPlanActions.updateExercises(this.props.id, this.state.savedExercises);
    return this.hideSectionTopics();
  },

  hideSectionTopics() {
    return this.setState({
      showSectionTopics: false,
    });
  },

  publish() {
    if (this.isSaveable()) { TaskPlanActions.publish(this.props.id); }
    return this.save();
  },

  isWaiting() {
    const { id } = this.props;
    return !!(TaskPlanStore.isSaving(id) || TaskPlanStore.isPublishing(id) || TaskPlanStore.isDeleteRequested(id));
  },

  isSaveable() {
    const { id } = this.props;

    return TaskPlanStore.isValid(id) &&
      TaskingStore.isTaskValid(id) &&
      !TaskPlanStore.isPublishing(id);
  },

  hasError() {
    return this.state.displayValidity && this.state.invalid;
  },

  updateValidity() {
    return this.setState({ invalid: !this.isSaveable() });
  },

  save() {
    const { id } = this.props;
    const course = this.getCourse();

    if (this.isSaveable()) {
      this.setState({ invalid: false });
      if (TaskPlanStore.hasChanged(id)) {
        TaskPlanStore.once(`saved.${id}`, this.saved);
        if (this.props.save != null) { this.props.save(id, course.id); } else { TaskPlanActions.save(id, course.id); }
      } else {
        this.saved();
      }
      return true;
    } else {
      this.setState({ invalid: true, displayValidity: true });
      return false;
    }
  },

  saved(savedPlan) {
    const course = this.getCourse();

    if (savedPlan) {
      TaskPlanActions.loaded(savedPlan, savedPlan.id);
      TaskingActions.loadTaskToCourse(savedPlan.id, course.id);
      TaskingActions.loadTaskings(savedPlan.id, savedPlan.tasking_plans);
      if (savedPlan.cloned_from_id) { this.getCourse().pastTaskPlans.delete(savedPlan.cloned_from_id); }
    }

    if (this.afterSave != null) { return this.afterSave(savedPlan); } else { return this.goBackToCalendar(); }
  },

  cancel() {
    const { id } = this.props;

    if (!TaskPlanStore.hasChanged(id)) {
      return this.reset();
    } else {
      return TutorDialog.show({
        title: 'Unsaved Changes - Confirm',
        body: 'You will lose unsaved changes if you continue.  Do you really want to cancel?',
        okBtnText: 'Yes',
        cancelBtnText: 'No',
      }).then( () => {
        return this.reset();
      });
    }
  },

  reset() {
    const { id } = this.props;
    TaskPlanActions.resetPlan(id);
    TaskingActions.resetFor(id);
    return this.goBackToCalendar();
  },

  // TODO move to helper type thing.
  getBackToCalendarParams() {
    let date;
    const { id } = this.props;
    const course = this.getCourse();

    const dueAt = TaskingStore.getFirstDueDate(id) || this.context.router.getCurrentQuery().due_at;
    if (dueAt != null) {
      date = dueAt;
    } else {
      date = TimeStore.getNow();
    }
    date = moment(date).format(CALENDAR_DATE_FORMAT);
    return { courseId: course.id, date };
  },

  goBackToCalendar() {
    return this.context.router.history.push(
      Router.makePathname('calendarByDate', this.getBackToCalendarParams())
    );
  },

  builderHeader(type, label = 'Assignment') {
    let headerText;
    const { id } = this.props;
    if (label) { label = ` ${label}`; }
    type = S.capitalize(type);

    if (TaskPlanStore.isNew(id)) {
      headerText = `Add ${type}${label}`;
    } else if (TaskPlanStore.isDeleteRequested(id)) {
      headerText = `${type} is being deleted`;
    } else {
      headerText = `Edit ${type}${label}`;
    }

    const headerSpan = <span key="header-text">
      {headerText}
    </span>;

    const closeBtn = <CloseButton key="close-button" className="pull-right" onClick={this.cancel} />;

    return [headerSpan, closeBtn];
  },


  makePlanRenderer(type, Type) {

    const getInitialState = () => {
      let { id, courseId } = Router.currentParams();
      if (!id || (id === 'new')) {
        id = TaskPlanStore.freshLocalId();
        TaskPlanActions.create(id, { type });
      }
      return { id, courseId };
    };

    return class extends React.Component {
      static displayName = `${type}Renderer`

      state = getInitialState()

      render() {
        const { id, courseId } = this.state;
        return (
          <LoadableItem
            id={id}
            store={TaskPlanStore}
            actions={TaskPlanActions}
            renderItem={() =>
              <TourRegion
                id={`${type}-assignment-editor`}
                otherTours={[`${type}-assignment-editor-super`]}
                courseId={courseId}
              >
                <Type id={id} courseId={courseId} />
              </TourRegion>}
          />
        );
      }
    };

  },

};

export default PlanMixin;
