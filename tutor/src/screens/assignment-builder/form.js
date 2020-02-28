import { computed, action, observable } from 'mobx';
import { get, set, isEmpty } from 'lodash';

class AssignmentForm {

  @observable isTouched = false;
  @observable hasSubmitted = false;

  constructor({ plan }) {
    this.plan = plan;

    this.title = {
      id: 'title',
      onChange: this.setter('title'),
      onFocus: this.onFocus,
      get value() { return plan.title; },
      validate(text) {
        if (!text || !text.match(/\w/)) { return ['required']; }
        return null;
      },
    };

    this.description = {
      id: 'description',
      onChange: this.setter('description'),
      onFocus: this.onFocus,
      maxLength: 250,
      get value() { return plan.description; },
    };

    if ('external' == plan.type) {
      this.externalUrl = {
        id: 'external-url',
        onChange: this.setter('settings.external_url'),
        onFocus: this.onFocus,
        disabled: !plan.canEdit,
        get value() { return get(plan, 'settings.external_url', ''); },
      };

    }
  }

  @action.bound onFocus() {
    this.isTouched = true;
    this.hasSubmitted = false;
  }

  setter(field) {
    return (value) => {
      set(this.plan, field, value);
    };
  }

  @computed get isValid() {
    return this.plan.isValid;
  }

  @computed get canSave() {
    return Boolean(this.hasSubmitted && this.isTouched && this.isValid);
  }

  @computed get showErrors() {
    return Boolean(this.hasSubmitted && !this.isValid);
  }

  @computed get showNeedsExercisesErrorMessage() {
    const { plan } = this;
    return Boolean(
      this.showErrors && plan.isHomework && isEmpty(plan.exerciseIds)
    );
  }

  async onSaveRequested() {
    this.hasSubmitted = true;
    if (!this.isValid) { return false; }

    const { plan } = this;

    try {
      await plan.save();
      this.hasSubmitted = false;
      return true;
    } catch (e) {
      this.errors = [e];
      return false;
    }
  }

}

export default AssignmentForm;
