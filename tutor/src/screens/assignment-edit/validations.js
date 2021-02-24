import { computed } from 'vendor';
import { isEmpty } from 'lodash';

class Validations {

    constructor(ux) {
        this.ux = ux;
    }

    get form() {
        return this.ux.form;
    }

    get plan() {
        return this.ux.plan;
    }

  @computed get isValid() {
        return !!this[this.ux.steps.currentStepId];
    }

  // tests
  @computed get details() {
      return Boolean(this.form &&
                   this.form.isValid &&
                   this.plan.tasking_plans.areValid());
  }

  @computed get chapters() {
      return !isEmpty(this.plan.pageIds);
  }

  @computed get questions() {
      return !isEmpty(this.plan.exerciseIds);
  }

  @computed get points() {
      return !isEmpty(this.plan.exerciseIds);
  }

  @computed get reorder() {
      return !isEmpty(this.plan.pageIds);
  }
}

export default Validations;
