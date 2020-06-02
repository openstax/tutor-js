import { action, observe } from 'mobx';
import { invoke } from 'lodash';

class Actions {
  constructor(ux) {
    this.ux = ux;
    observe(ux.steps, 'currentStepId', ({ newValue: stepId, oldValue: prevStepId }) => {
      invoke(this, stepId, { prevStepId });
    }, true); // true == invoke immediatly
  }

  @action async chapters() {
    await this.ux.referenceBook.ensureLoaded();
  }

  @action async questions() {
    await this.ux.referenceBook.ensureLoaded();
    
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
