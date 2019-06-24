import { action, computed, observable } from 'mobx';
import moment from 'moment';
import { max } from 'lodash';
import Time from '../../models/time';
import { findEarliest } from '../../helpers/dates';

class AssignmentBuilderUX {

  @observable isShowingPeriodTaskings = false;

  constructor({ plan, course }) {
    this.plan = plan;
    this.course = course;
    this.isShowingPeriodTaskings = !plan.areTaskingDatesSame;
  }


  @action.bound onCancel() {

  }

  @action.bound async onDelete() {

  }

  @action.bound async onSave() {
    await this.plan.save();
    this.onCancel();
  }

  @action.bound async onSaveAsDraft() {
    this.plan.is_draft = true;
    return this.onSave();
  }

  // @action.bound onPublish() {
  //   this.plan.publish();
  // }

  @computed get hasError() {
    return false;
  }

  @computed get isWaiting() {
    return false;
  }

  @computed get isSaving() {
    return this.plan.api.isPending;
  }

  @action.bound onShowSectionTopics() {

  }

  @action.bound setTitle(title) {
    this.plan.title = title;
  }

  @action.bound setDescription(description) {
    this.plan.description = description;
  }

  @computed get term() {
    return {
      start: moment(this.course.starts_at),
      end: moment(this.course.starts_at),
    };
  }

  @action.bound togglePeriodTaskingsEnabled(ev) {
    this.isShowingPeriodTaskings = ev.target.value == "periods";
  }
  // @computed get dueAt() {
  //   const opens = this.term.start.isAfter(Time.now) ?
  //     this.term.start : moment(Time.now);
  //   return {
  //     min: max([findEarliest([
  //       Time.now, this.term.start, this.plan.dueRange.opens_at,
  //     ]), Time.now]),
  //     max:  this.term.end,
  //   };
  // }

  @computed get maxDueAt() {
    return {
      date: this.term.end.format('YYYY-MM-DD'),
      time: this.course.default_due_time,
    };
  }

}

export default AssignmentBuilderUX;
