import { isString, get, pick, extend } from 'lodash';
import { computed, action } from 'mobx';
import {
  BaseModel, identifiedBy, field, identifier, session,
} from 'shared/model';

export default
@identifiedBy('practice-questions/practice-question')
class PracticeQuestion extends BaseModel {

  @identifier id;
  @field exercise_number;
  @field exercise_version;
  @field tasked_exercise_id;
  @field available;

  constructor(attrs = {}, map) {
    super(attrs);
    this.map = map;
  }

  @computed get uid() {
    return `${this.exercise_number}@${this.exercise_version}`;
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
