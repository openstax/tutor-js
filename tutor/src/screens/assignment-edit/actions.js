import { action, observe } from 'mobx';
import { invoke } from 'lodash';

class Actions {
  constructor(ux) {
    this.ux = ux;
    observe(ux.steps, 'currentStepId', ({ newValue: stepId, oldValue: prevStepId }) => {
      invoke(this, stepId, { prevStepId });
    });
  }

  @action.bound async questions({ prevStepId }) {
    // only load if they're going foward, don't load if they're going back to review
    if (prevStepId !== 'chapters') { return; }

    await this.ux.exercises.fetch({
      course: this.ux.course,
      book: this.ux.referenceBook,
      page_ids: this.ux.selectedPageIds,
    });

    this.ux.selectedPageIds.forEach(pgId => {
      this.ux.exercises.forPageId(pgId).forEach(
        e => e.isSelected = this.ux.plan.includesExercise(e)
      );
    });
  }

}

export { Actions };
