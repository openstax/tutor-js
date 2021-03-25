import { extend } from 'lodash';
import { BaseModel, field, modelize, computed, action, NEW_ID } from 'shared/model';

export default class PracticeQuestion extends BaseModel {

  @field id = NEW_ID;
  @field tasked_exercise_id;
  @field exercise_id;
  @field available;

  constructor(attrs = {}, map) {
      super(attrs);
      modelize(this);
      this.map = map;
  }

  save() {
      return extend(this.urlParams, {
          data: {
              tasked_exercise_id: this.tasked_exercise_id,
          },
      });
  }

  @action onSaved({ data }) {
      this.update(data);
      if (!this.map.get(this.id)) {
      // delete the pending key, and set the new one with its id and the data
          this.map.delete('pending');
          this.map.set(this.id, this);
      }
  }

  destroy() {
      return this.urlParams;
  }

  onDestroyed() {
      if (this.map.get(this.id)) {
          this.map.delete(this.id);
      }
  }

  @computed get urlParams() {
      return {
          id: this.id,
          courseId: this.map.course.id,
      };
  }

}
