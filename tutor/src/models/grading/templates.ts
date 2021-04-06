import { isNil, defaults } from 'lodash';
import type Course from '../course'
import DateTime from 'shared/model/date-time'
import { GradingTemplateObj } from '../types'
import {
    BaseModel, model, action, field, getParentOf, computed,
    ID, NEW_ID, Map, serialize, modelize, hydrateModel, hydrateInstance,
} from 'shared/model';
import S from '../../helpers/string';
import urlFor from '../../api'

class GradingTemplate extends BaseModel {

    // returns a formik errors object as described:
    // https://jaredpalmer.com/formik/docs/guides/validation
    static validate(_tmpl: GradingTemplate, _form: any) { // eslint-disable-line no-unused-vars
        return {};
    }

    @field id = NEW_ID;
    @field name = '';
    @field task_plan_type?: 'homework' | 'reading';
    @field completion_weight = 0;
    @field correctness_weight = 0;
    @model(DateTime) deleted_at?: DateTime;
    @field auto_grading_feedback_on = 'answer';
    @field manual_grading_feedback_on = false;
    @field late_work_penalty = 0.1;
    @field late_work_penalty_applied = '';
    @field default_open_time = '00:01';
    @field default_due_time = '21:00';
    @field default_due_date_offset_days = 7;
    @field default_close_date_offset_days = 7;
    @field has_open_task_plans = false;

    get map() { return getParentOf<GradingTemplates>(this) }

    constructor(attrs?: GradingTemplateObj) {
        super();
        modelize(this)

        if (!attrs || !attrs.id) {
            if (this.isReading) {
                defaults(this, {
                    completion_weight: 0.9,
                    correctness_weight: 0.1,
                    manual_grading_feedback_on: 'publish',
                    late_work_penalty_applied: 'immediately',
                });
            }
            if (this.isHomework) {
                defaults(this,{
                    completion_weight: 0.0,
                    correctness_weight: 1.0,
                    late_work_penalty_applied: 'daily',
                    manual_grading_feedback_on: 'grade',
                });
            }
        }
    }

    @computed get course() {
        return this.map && this.map.course;
    }

    @computed get isReading() {
        return 'reading' === this.task_plan_type;
    }

    @computed get isHomework() {
        return 'homework' === this.task_plan_type;
    }

    @computed get isLateWorkAccepted() {
        return this.late_work_penalty_applied !== 'not_accepted';
    }

    @computed get humanLateWorkPenaltyApplied() {
        const penalties = {
            immediately: 'Per assignment',
            daily: 'Per day',
            not_accepted: 'Not accepted',
        };
        return penalties[this.late_work_penalty_applied];
    }

    @computed get humanLateWorkPenalty() {
        return this.isLateWorkAccepted ? `-${S.asPercent(this.late_work_penalty)}%` : 'n/a';
    }

    @computed get humanCompletionWeight() {
        return `${S.asPercent(this.completion_weight)}%`;
    }

    @computed get humanCorrectnessWeight() {
        return `${S.asPercent(this.correctness_weight)}%`;
    }

    @computed get humanTotalWeight() {
        return `${S.asPercent(this.correctness_weight + this.completion_weight)}%`;
    }

    @computed get canEdit() {
        return Boolean(this.course && this.course.isWRM);
    }

    @computed get canRemove() {
        // a template can be removed as if there is at least one other with the same type
        return Boolean(this.canEdit && this.map && this.map.array.find(t => t !== this && t.task_plan_type === this.task_plan_type));
    }

    @computed get defaultTimes() {
        const opens = this.default_open_time.split(':').map(Number)
        const due = this.default_due_time.split(':').map(Number)
        return {
            due: { hour: due[0], minute: due[1] },
            opens: { hour: opens[0], minute: opens[1] },
        }
    }

    // called from api
    async save() {
        const data = await this.api.request<GradingTemplateObj>(
            this.isNew ?
                urlFor('createGradingTemplate', { courseId: this.course.id }) :
                urlFor('saveGradingTemplate', { templateId: this.id }),
            { data: serialize(this) }
        )
        await this.onSaved(data)
    }


    @action async onSaved(data: GradingTemplateObj) {
        hydrateInstance(this, data);
        if (!this.map.get(this.id)) {
            this.map.set(this.id, this);
        }
    }

    async remove() {
        await this.api.request<GradingTemplateObj>(urlFor('deleteGradingTemplate', { templateId: this.id }))
        this.onRemoved()
    }

    @action onRemoved() {
        this.deleted_at = DateTime.now
    }

    // Validate happens if template name, case insensitive, equals to any of the other template names.
    isDuplicateName(id: ID, name: string) {
        return Boolean(this.map && this.map.array.some(t => t.id !== id && t.name.toLowerCase() === name.toLowerCase()));
    }
}


class GradingTemplates extends Map<ID, GradingTemplate> {

    static Model = GradingTemplate;

    constructor() {
        super();
        modelize(this)
    }

    get course() { return getParentOf<Course>(this) }

    @computed get undeleted() {
        return this.where(gt => isNil(gt.deleted_at));
    }

    newTemplate(attrs: GradingTemplateObj) {
        return hydrateModel(GradingTemplate, attrs, this)
    }

    // called by API
    async fetch() {
        const templates = await this.api.request<{ items: GradingTemplateObj[] }>(urlFor('fetchGradingTemplates', { courseId: this.course.id }))
        this.onLoaded(templates.items)
        // this.onRemoved()

        // return { courseId: this.course.id };
    }

    @action onLoaded(templates: GradingTemplateObj[] ) {
        this.mergeModelData(templates)
    }


}

export { GradingTemplate, GradingTemplates };
