import {
    BaseModel, observable, computed, model, field, modelize, NEW_ID, ID, getParentOf, array,
} from 'shared/model';
import { find, isEmpty } from 'lodash';
import { TaskPlanType, ChapterSection, Exercise } from '../../../models'
import type { TeacherTaskPlan } from './plan'
import urlFor from '../../../api'

class AnswerStat extends BaseModel {

    @observable answer_id:ID = NEW_ID;
    @observable selected_count = 0;

    get answer() { return getParentOf<Answer>(this) }

    get question() { return this.answer.question }

    constructor() {
        super();
        modelize(this);
    }

    @computed get id() { return this.answer_id; }

}

class Student extends BaseModel {

    @field id = NEW_ID;
    @field name = '';

}

class Answer extends BaseModel {
    @observable free_response = '';
    @observable answer_id:ID = NEW_ID;

    @model(Student) students = [];

    get question() { return getParentOf<TaskPlanQuestionStats>(this) }

    constructor() {
        super();
        modelize(this);
    }

    @computed get selected_count() {
        return find(this.question.answer_stats, anst => anst.answer_id == this.answer_id)?.selected_count || 0;
    }

}

export class TaskPlanQuestionStats extends BaseModel {
    @observable question_id:ID = NEW_ID;
    @observable answered_count = 0;

    @model(Answer) answers = array((answers: Answer[]) => ({
        get withFreeResponse() {
            return answers.filter(ans => !isEmpty(ans.free_response));
        },
    }))

    @model(AnswerStat) answer_stats = array((stats: AnswerStat[]) => ({
        get correct() { return find(stats, { isCorrect: true }); },
    }))

    constructor() {
        super();
        modelize(this);
    }

    @computed get hasFreeResponse() {
        return find(this.answers, a => !isEmpty(a.free_response));
    }

}

export class TaskPlanPageStats extends BaseModel {
    @field id = NEW_ID;
    @observable title = '';
    @observable correct_count = 0;
    @observable incorrect_count = 0;
    @observable is_trouble = false;
    @observable student_count = 0;
    @model(ChapterSection) chapter_section = ChapterSection.blank
    @model(Exercise) exercises = array<Exercise>()

    constructor() {
        super();
        modelize(this);
    }
}

export class Stats extends BaseModel {
    @observable period_id:ID = NEW_ID;
    @observable name = '';
    @observable total_count = 0;
    @observable complete_count = 0;
    @observable partially_complete_count = 0;
    @observable is_trouble = false;

    constructor() {
        super();
        modelize(this);
    }
}

export class TaskPlanStats extends BaseModel {
    @field id = NEW_ID;
    @observable title = '';
    @observable type: TaskPlanType = '';

    @observable shareable_url = '';

    @model(Stats) stats: Stats[] = [];

    get taskPlan() { return getParentOf<TeacherTaskPlan>(this) }

    constructor() {
        super();
        modelize(this);
    }

    async fetch() {
        const data = await this.api.request(urlFor('fetchTaskPlanStats', { taskPlanId: this.id }))
        this.update(data)
    }

    async fetchReview() {
        const data = await this.api.request(urlFor('fetchTaskPlanReview', { taskPlanId: this.id }))
        this.update(data)
    }
}
