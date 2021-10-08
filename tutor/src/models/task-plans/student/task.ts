import { get, isNil } from 'lodash';
import ScoresHelper, { UNWORKED } from '../../../helpers/scores';
import {
    BaseModel, field, modelize, observable, computed, model, NEW_ID, getParentOf,
} from 'shared/model';
import Time from 'shared/model/time';
import { StudentTaskPlans } from '../../../models';

// a task on the student's dashboard
export class StudentDashboardTask extends BaseModel {

    @observable hidden = false;

    @field id = NEW_ID;
    @field title = '';
    @field type = '';
    @field complete = false;
    @field published_points = 0; // points that are visible to the student
    @field is_provisional_score = false;
    @field is_deleted = false;
    @field is_college = false;
    @field is_extended = false;
    @field is_past_due = false;
    @field complete_exercise_count = 0;
    @field correct_exercise_count = 0;
    @field exercise_count = 0;
    @field completed_accepted_late_exercise_count = 0;
    @field completed_on_time_exercise_count = 0;
    @field task_plan_id = NEW_ID;
    @field steps_count = 0;
    @field completed_steps_count = 0;
    @field completed_on_time_steps_count = 0;
    @field completed_accepted_late_steps_count = 0;
    @field description = '';
    @model(Time) last_worked_at = Time.unknown
    @model(Time) due_at = Time.unknown
    @model(Time) opens_at = Time.unknown
    @model(Time) accepted_late_at = Time.unknown

    constructor() {
        super()
        modelize(this)
    }

    get tasks() {
        return getParentOf<StudentTaskPlans>(this)
    }

    @computed get workedLate() {
        return Boolean(
            !this.last_worked_at.isUnknown && this.last_worked_at.isAfter(this.due_at)
        )
    }

    @computed get isPastDue() {
        return this.due_at.isInPast
    }

    @computed get isAlmostDue() {
        return this.due_at.distanceToNow('day') == 1
    }

    @computed get scoreShown() {
        return Boolean(this.isPastDue && this.complete);
    }

    @computed get isHomework() {
        return 'homework' === this.type;
    }

    @computed get isReading() {
        return 'reading' === this.type;
    }

    @computed get isExternal() {
        return 'external' == this.type;
    }

    @computed get isStarted() {
        return this.completed_steps_count > 0;
    }

    @computed get isHidden() {
        return Boolean(this.hidden || (this.is_deleted && !this.isStarted));
    }

    @computed get isTeacherStudent(): boolean {
        return get(this, 'tasks.course.currentRole.isTeacherStudent', false);
    }

    @computed get isOpen() {
        return this.opens_at.isInPast
    }

    @computed get isViewable() {
        //students cannot work or view a task if it has been deleted and they haven't started it
        return Boolean(
            this.isTeacherStudent || (
                this.isOpen && !(
                    this.is_deleted &&
            this.complete_exercise_count === 0
                )
            )
        );
    }

    @computed get humanProgress() {
        if (this.isHomework || this.isReading) {
            if (!this.isStarted) { return 'Not started'; }
            if (this.complete) { return 'Complete'; }
            return this.isHomework ? this.homeworkProgressSteps : 'In progress';
        } else if (this.isExternal) {
            return this.complete ? 'Clicked' : 'Not started';
        }
        return '';
    }

    @computed get homeworkProgressSteps() {
        return `${this.completed_steps_count}/${this.steps_count} completed`;
    }

    @computed get humanScore() {
        return isNil(this.published_points) ? UNWORKED : ScoresHelper.formatPoints(this.published_points);
    }

    // called from API
    hide() {}
    onHidden() {
        this.hidden = true;
    }
}
