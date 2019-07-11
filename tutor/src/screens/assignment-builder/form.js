import { action, computed, observable } from 'mobx';

// import validatorjs from 'validatorjs';
// import { Form } from 'mobx-react-form';
import { get, set, mapValues, every } from 'lodash';

class AssignmentForm {

  @observable isDirty = false;

  constructor({ plan }) {
    this.plan = plan;

    this.title = {
      onChange: this.setter('title'),
      get value() { return plan.title; },
      disabled: !plan.canEdit,
      validate(text) {
        if (!text || !text.match(/\w/)) { return ['required']; }
        return null;
      },
    };

    this.description = {
      onChange: this.setter('description'),
      disabled: !plan.canEdit,
      get value() { return plan.description; },
    };

    if ('external' == plan.type) {
      this.externalUrl = {
        onChange: this.setter('settings.external_url'),
        disabled: !plan.canEdit,
        get value() { return get(plan, 'settings.external_url', ''); },
      };

    }

  }

  setter(field) {
    this.isDirty = true;
    return (value) => {
      set(this.plan, field, value);
    };
  }

  @computed get isValid() {
    return this.plan.isValid;
  }

  @computed get canSave() {
    return Boolean(this.isDirty && this.isValid);
  }

  // async fetchOrReset() {
  //   const { plan } = this;
  //   if (plan.isNew) {
  //     await plan.reset();
  //   } else {
  //     await plan.fetch();
  //   }

  //   this.update(plan.serialize());
  // }

  async onSaveRequested() {
    if (!this.isValid) { return; }

    const { plan } = this;

    try {
      await plan.save();
      this.isDirty = false;
    } catch (e) {
      console.log("CatCh", e)

      this.errors = [e];
    }
  }

}

export default AssignmentForm;
