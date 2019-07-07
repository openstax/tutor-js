import dvr from 'mobx-react-form/lib/validators/DVR';
import { computed } from 'mobx';
import validatorjs from 'validatorjs';
import { Form, Field } from 'mobx-react-form';
import { mapValues, every } from 'lodash';

class AssignmentForm extends Form {

  constructor(ux) {
    const { plan, course } = ux;

    const fields = [
      { name: 'title', rules: 'required|string', value: plan.title },
      { name: 'description', value: plan.description },
    ];
    if (plan.isExternal) {
      fields.push({
        name: 'externalUrl', rules: 'required|url', value: plan.settings.external_url,
      });
    }

    // fields.push({
    //   name: 'tasking_plans',
    //   fields: flatMap(course.periods, (period) => {
    //     const tasking = plan.findOrCreateTaskingForPeriod(period);
    //     return [
    //       { name: `${period.id}-opens`, value: tasking.opens_at, rules: 'date' },
    //       { name: `${period.id}-due`, value: tasking.due_at, rules: 'date' },
    //     ];
    //   }),
    // });

    // console.log(fields[2]);

    super({ fields }, {
      options: {
        validateOnInit: false,
        validateOnChange: false,
        validateOnChangeAfterSubmit: true,
      },
      plugins: { dvr: dvr(validatorjs) },
    });
    // console.log(this.values());
    this.plan = plan;
    this.fetchOrReset();
  }

  async fetchOrReset() {
    const { plan } = this;
    if (plan.isNew) {
      await plan.reset();
    } else {
      await plan.fetch();
    }

    this.update(plan.serialize());
  }

  async onSaveRequested(e) {
    this.onSubmit(e);

    if (!this.isValid) {
      return;
    }

    const { plan } = this;

    const values = mapValues(this.get(), 'value');
    plan.update(values);
    if (values.externalUrl) {
      plan.settings.external_url = values.externalUrl;
    }
    await plan.save();
    this.update(plan.serialize());
  }

  @computed get canSave() {
    return Boolean(
      this.changed && this.isValid && every(this.plan.tasking_plans, 'isValid'),
    );
  }
}

export default AssignmentForm;
