import { observable } from 'mobx';
import { computed } from 'mobx';
import Time from '../time';
import {
  BaseModel, identifiedBy, field, identifier,
} from 'shared/model';

export default
@identifiedBy('student/task')
class StudentTask extends BaseModel {

  @observable hidden = false;


  @identifier id;
  @field title;
  @field type;
  @field complete;
  @field is_deleted;
  @field is_college;
  @field complete_exercise_count = 0;
  @field correct_exercise_count;
  @field exercise_count = 0;
  @field completed_accepted_late_exercise_count = 0;
  @field completed_on_time_exercise_count = 0;

  @field steps_count = 0;
  @field completed_steps_count = 0;
  @field completed_on_time_steps_count = 0;
  @field completed_accepted_late_steps_count = 0;

  @field({ type: 'date' }) last_worked_at;
  @field({ type: 'date' }) due_at;
  @field({ type: 'date' }) opens_at;
  @field({ type: 'date' }) accepted_late_at;

  @computed get workedLate() {
    return this.complete_exercise_count !== this.completed_on_time_exercise_count;
  }

  @computed get lateWorkIsAccepted() {
    return Boolean(this.accepted_late_at);
  }

  @computed get isHomework() {
    return 'homework' === this.type;
  }

  @computed get canWork() {
    //students cannot work or view a task if it has been deleted and they haven't started it
    return Boolean(
      this.opens_at < Time.now && !(
        this.is_deleted &&
        this.complete_exercise_count === 0
      )
    );
  }

  // called from API
  hide() {}
  onHidden() {
    this.hidden = true;
  }
};
