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
    return this.form.values;
  }

  @computed get isValid() {
    return !!this[this.ux.currentStepId];
  }

  // tests
  @computed get details() {
    return Boolean(this.form && this.form.isValid);
  }

  @computed get chapters() {
    return !isEmpty(this.plan.pageIds);
  }

  @computed get questions() {
    return !isEmpty(this.plan.exerciseIds);
  }
}

export default Validations;
