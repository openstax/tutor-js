import { action, observe } from 'mobx';
import { invoke } from 'lodash';

class Actions {
    constructor(ux) {
        this.ux = ux;
        observe(ux.steps, 'currentStepId', ({ newValue: stepId, oldValue: prevStepId }) => {
            invoke(this, stepId, { prevStepId });
        }, true); // true == invoke immediatly
    }

    async needsBook() {
        return this.ux.referenceBook.ensureLoaded();
    }

    async needsExercises() {
        return this.ux.exercises.ensureExercisesLoaded({
            course: this.ux.course,
            ecosystem_id: this.ux.plan.ecosystem_id,
            exercise_ids: this.ux.plan.exerciseIds,
            page_ids: this.ux.selectedPageIds,
        });
    }

  @action chapters() {
        this.needsBook();
    }
  
  @action reorder() {
      this.needsBook();
  }

  @action async points() {
      this.needsBook();
      this.needsExercises();
  }

  @action async questions() {
      this.needsBook();
      // on questions we always load by not using "ensureLoaded"
      await this.ux.exercises.fetch({
          ecosystem_id: this.ux.plan.ecosystem_id,
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
