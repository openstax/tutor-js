import { action, computed } from 'mobx';

class AssignmentBuilderUX {

  constructor({ plan, course }) {
    this.plan = plan;
    this.course = course;
  }

  @action.bound onCancel() {

  }

  @action.bound onSave() {
    this.plan.save();
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
    console.log(
      Array.from(this.plan.api.requestsInProgress.keys()),
    )
    return this.plan.api.isPending;
  }

  @action.bound onShowSectionTopics() {

  }

}

export default AssignmentBuilderUX;
