import { action, computed } from 'mobx';

class AssignmentBuilderUX {

  constructor({ plan, course }) {
    this.plan = plan;
    this.course = course;
  }

  @action.bound onCancel() {

  }

  @action.bound onSave() {

  }

  @action.bound onPublish() {

  }

  @computed get hasError() {
    return false;
  }

  @action.bound onShowSectionTopics() {

  }

}

export default AssignmentBuilderUX;
