import { BaseModel, field, model, action, computed, observable, NEW_ID, getParentOf } from 'shared/model';
import Time from 'shared/model/time';
import type { StudentTasks } from '../student-tasks';
import { defaults, countBy, isEmpty, sumBy } from 'lodash';
import StudentTaskStep from './step';
import Student from './student';
import S from '../../helpers/string';
import urlFor from '../../api'

export { StudentTaskStep };

export default class StudentTask extends BaseModel {

    @field id = NEW_ID;
    @field title = '';
    @field description = '';
    @field type = '';
    @field is_deleted = false;
    @field completion_weight = 0;
    @field correctness_weight = 0;
    @field late_work_penalty_applied?: string;
    @field late_work_penalty_per_period = 0;
    @field published_late_work_point_penalty = 0; // point penalty that is visible to the student
    @field published_points = 0; // points that are visible to the student
    @field spy?: any;
    @model(Time) due_at = Time.unknown;
    @model(Time) closes_at = Time.unknown;

    @field is_provisional_score = false;

    @model(Student) students: Student[] = [];
    @model(StudentTaskStep) steps: StudentTaskStep[] = [];

    get tasksMap() { return getParentOf<StudentTasks>(this) }

    @computed get isReading() { return 'reading' === this.type; }
    @computed get isHomework() { return 'homework' === this.type; }
    @computed get isEvent() { return 'event' === this.type; }
    @computed get isExternal() { return 'external' === this.type; }

    @computed get isPractice() { return ['practice_saved', 'page_practice', 'practice_worst_topics'].includes(this.type); }
    @computed get isSavedPractice() { return this.type === 'practice_saved'; }
    @observable isLoading = false

    @computed get publishedLateWorkPenalty() {
        return sumBy(this.steps, 'published_late_work_point_penalty');
    }

    @computed get publishedPoints() {
        return sumBy(this.steps, 'published_points');
    }

    @computed get course() {
        return this.tasksMap.course;
    }

    @computed get progress() {
        return defaults(
            countBy(this.steps, s => s.is_completed ? 'complete' : 'incomplete'), {
                complete: 0,
                incomplete: 0,
            }
        );
    }

    @computed get hasLateWorkPolicy() {
        return Boolean(this.isHomework || this.isReading);
    }

    @computed get humanLateWorkPenalty() {
        const amount = this.late_work_penalty_applied !== 'not_accepted' ? this.late_work_penalty_per_period : 1;
        return `${S.asPercent(amount)}%`;
    }

    @computed get availablePoints() {
        return sumBy(this.steps, 'available_points');
    }

    // if the task's first step is a placeholder, we want to keep fetching it until it isn't
    @computed get isLoaded() {
        return Boolean(this.api.hasBeenFetched && (isEmpty(this.steps) || !this.steps[0].isPlaceHolder));
    }

    @computed get isAssignmentClosed() {
        // console.log(this.closes_at.isValid, this.closes_at.isInPast)
        // console.log(this.closes_at.asISOString, Time.unknown.asISOString , this.closes_at.isUnknown)
        return this.closes_at.isValid && this.closes_at.isInPast
    }

    @computed get completed() {
        return this.steps.every(s => s.is_completed);
    }

    @computed get started() {
        return this.steps.some(s => s.is_completed);
    }

    // called by API
    async fetch() {
        const data = this.api.request(urlFor('fetchStudentTask', { taskId: this.id }))
        this.onFetchComplete(data)
    }

    @action onFetchComplete(data:any) {
        const { steps, ...task } = data;
        this.api.errors.clear()
        this.update(task);
        steps.forEach((stepData:any, i:number) => {
            if (this.steps.length > i) {
                this.steps[i].setFromTaskFetch(stepData);
            } else {
                this.steps.push(stepData);
            }
        });
        if (steps.length < this.steps.length) {
            this.steps.splice(steps.length, this.steps.length - steps.length);
        }
    }

    exit() {
        return {
            courseId: this.course.id,
            id: this.id,
        };
    }
}
