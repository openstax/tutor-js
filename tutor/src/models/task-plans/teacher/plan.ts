import {
    BaseModel, field, action, computed, observable, model, lazyGetter,
    array, modelize, NEW_ID, ID, override, hydrateInstance, hydrateModel,
} from 'shared/model';
import { createAtom, IAtom, toJS } from 'mobx'
import Time, { Interval, findEarliest, findLatest } from 'shared/model/time';
import {
    first, last, map, flatMap, find, get, pick, extend, every, isEmpty,
    compact, findIndex, filter, includes, uniq, unionBy, pickBy, identity,
} from 'lodash';
import isUrl from 'validator/lib/isURL';
import urlFor from '../../../api';
import moment from '../../../helpers/moment-range';
import { TASK_PLAN_SELECTION_COUNTS } from '../../../config';

import type {
    CoursePeriod, Course, ReferenceBookNode as Page,
    TaskPlanExtensionData, TeacherTaskPlanData, TeacherTaskPlanSettingsData,
    TeacherTaskPlanTaskingPlanData,
} from '../../../models'

import {
    TaskPlanPublishJob as TaskPlanPublish,
    TaskingPlan, DroppedQuestion, TaskPlanScores,
    currentExercises, TaskPlanStats, Exercise, ExercisesMap,
} from '../../../models'


export const calculateDefaultOpensAt = ({ course }: { course: Course }) => {
    const defaultOpensAt = Time.now.plus({ day: 1 }).startOf('minute');
    if (!course) {
        return defaultOpensAt.toISOString();
    }
    const { hour, minute } = course.defaultTimes.opens
    return findLatest(
        findEarliest(
            course.bounds.end.minus({ day: 1 }),
            defaultOpensAt,
        ),
        course.bounds.start.plus({ day: 1 }),
    ).set({ hour, minute }).startOf('minute').toISOString();
};


class QuestionInfo {
    constructor(attrs: any) {
        Object.assign(this, attrs);
    }
}

export class TeacherTaskPlan extends BaseModel {

    @field id:ID = NEW_ID;
    @field title = '';
    @field description = '';
    @field type = '';

    @field ecosystem_id = NEW_ID;
    @model(Time) first_published_at?: Time;
    @model(Time) last_published_at?: Time;
    @model(Time) publish_last_requested_at?: Time;
    @field failed_at?: Time ;
    @field killed_at?: Time ;
    @field is_draft = false;
    @field is_preview = false;
    @field is_published = false;
    @field is_publishing = false;
    @field is_deleting = false;
    @field is_trouble = false;
    @field cloned_from_id: ID | null = null
    @field publish_job_url: string | null = null;
    @field grading_template_id = NEW_ID;
    @field ungraded_step_count = 0;
    @field gradable_step_count = 0;
    @field wrq_count = 0;
    @field extensions: TaskPlanExtensionData[] = []
    @field settings: TeacherTaskPlanSettingsData = {};

    @model(DroppedQuestion) dropped_questions: DroppedQuestion[] = [];

    @model(TaskingPlan) tasking_plans = array((plans: TaskingPlan[]) => ({
        forPeriod(period: CoursePeriod) { return find(plans, { target_id: period.id, target_type: 'period' }); },
        areValid() { return Boolean(plans.length > 0 && every(this, 'isValid')); },
    }))

    @observable unmodified_plans: TeacherTaskPlanTaskingPlanData[] = [];

    // only set when publishing
    @field is_feedback_immediate = false;
    @field is_publish_requested = false;

    @observable publishingUpdates = false;
    publishing?: IAtom

    course: Course
    exercisesMap: ExercisesMap

    constructor({ course, exercisesMap } : { course: Course, exercisesMap?: ExercisesMap }) {
        super();
        modelize(this);
        this.course = course
        this.exercisesMap = exercisesMap || currentExercises
    }

    static hydrate(attrs: any) {
        const plan = new TeacherTaskPlan(attrs)
        hydrateInstance(plan, attrs)
        plan.unmodified_plans = attrs.tasking_plans;

        plan.publishing = createAtom(
            'TaskPlanUpdates',
            () => { TaskPlanPublish.forPlan(plan).startListening(); },
            () => { TaskPlanPublish.stopPollingForPlan(plan); },
        );
        if (plan.isNew && !plan.isClone) {
            Object.assign(plan.settings, plan.defaultSettings);
        }
        return plan
    }

    @computed get defaultSettings() {
        if (this.isHomework) {
            return {
                exercises: [],
                exercises_count_dynamic: TASK_PLAN_SELECTION_COUNTS.default,
            };
        }
        if (this.isReading) {
            return {
                page_ids: [],
            };
        }
        if (this.isExternal) {
            return { external_url: '' };
        }
        return {};
    }

    @computed get gradingTemplate() {
        return this.course.gradingTemplates.get(this.grading_template_id);
    }

    @lazyGetter get scores() { return hydrateModel(TaskPlanScores, { id: this.id }, this) }
    @lazyGetter get analytics() {  return hydrateModel(TaskPlanStats, { id: this.id }, this) }

    findOrCreateTaskingForPeriod(period: CoursePeriod, defaultAttrs:any = {}) {
        let tp = this.tasking_plans.forPeriod(period);
        if (tp) { return tp; }

        this.tasking_plans.push({
            ...defaultAttrs,
            opens_at: calculateDefaultOpensAt({ course: this.course }),
            target_id: period.id, target_type: 'period',
        } as any);
        tp = this.tasking_plans[this.tasking_plans.length - 1];
        if (this.gradingTemplate) {
            tp.onGradingTemplateUpdate(this.gradingTemplate, defaultAttrs.dueAt);
        }

        return tp;
    }

    @computed get isClone() {
        return !!this.cloned_from_id;
    }

    @computed get isNew() {
        return Boolean(!this.id || 'new' == this.id);
    }

    @computed get canGrade() {
        return Boolean(this.isHomework && this.ungraded_step_count > 0);
    }

    @computed get canGrantExtension() {
        return Boolean(this.isHomework || this.isReading);
    }

    @computed get opensAtString() {
        const opens = this.course.dateTimeInZone(this.interval.start);

        // it's open
        if (opens.isInPast) {
            return null;
        }
        if (opens.isSame(Time.now, 'day')) {
            return opens.format('h:mm a z');
        }
        return opens.format('M/D');
    }

    @computed get interval() {
        return new Interval({ start: this.dateRanges.opens.start, end: this.dateRanges.due.end })
    }

    intervalFor(attr: 'opensAt' | 'dueAt' | 'closesAt') {
        const dates = map(this.tasking_plans, attr).sort()
        return new Interval({ start: first(dates) as Time, end: last(dates) as Time })
    }

    get dateRanges() {
        return {
            due: this.intervalFor('dueAt'),
            opens: this.intervalFor('opensAt'),
            closes: this.intervalFor('closesAt'),
        };
    }

    @computed get areTaskingDatesSame() {
        return Boolean(
            (0 === this.dateRanges.opens.length('minute')) &&
                (0 === this.dateRanges.due.length('minute')) &&
                (0 === this.dateRanges.closes.length('minute')),
        );
    }

    @action onPublishComplete() {
        this.is_published = true;
        this.is_publishing = false;
        this.publish_job_url = null;
    }

    @action _moveSettings(type: string, match: any, step: number) {
        const curIndex = findIndex(this.settings[type], match);
        if (-1 === curIndex){ return; }

        let newIndex = curIndex + step;
        if (newIndex < 0) {
            newIndex = 0;
        }
        if (!(newIndex < this.settings[type].length)) {
            newIndex = this.settings[type].length - 1;
        }
        const value = this.settings[type][curIndex];
        this.settings[type][curIndex] = this.settings[type][newIndex];
        this.settings[type][newIndex] = value;
    }

    @action _removeSettings(type: string, match: any) {
        const indx = findIndex(this.settings[type], match);
        if (-1 !== indx) {
            this.settings[type].splice(indx, 1);
        }
    }

    @action.bound removePage(page: Page) {
        this._removeSettings('page_ids', (n:number) => n == page.id);
    }

    @action.bound movePage(page: Page, step: number) {
        this._moveSettings('page_ids', (n:number) => n == page.id, step);
    }

    @action.bound removeExercise(ex: Exercise) {
        this._removeSettings('exercises', { id: ex.id });
    }

    @action moveExercise(ex: Exercise, step: number) {
        this._moveSettings('exercises', { id: ex.id }, step);
    }


    @computed get isEvent() { return 'event' === this.type; }
    @computed get isReading() { return 'reading' === this.type; }
    @computed get isHomework() { return 'homework' === this.type; }
    @computed get isExternal() { return 'external' === this.type; }
    @computed get isPractice() {
        return includes(['practice_worst_topics', 'page_practice', 'practice_saved'], this.type);
    }

    // camelcase versions to match existing API
    @computed get isPublished() { return this.is_published; }
    @computed get isPublishing() { return this.is_publishing; }
    @computed get isTrouble() { return this.is_trouble; }
    @computed get isOpen() {
        return Boolean(
            this.isPublished && this.tasking_plans.length && this.interval.start.isInPast
        );
    }
    @computed get isEditable() {
        // at one time this had date logic, but now
        // teachers are allowed to edit at any time
        return true ;
    }
    @computed get isFailed() { return Boolean(this.failed_at || this.killed_at); }
    @computed get isPastDue() { return this.interval.end.isInPast }
    @computed get isGradeable() { return this.dateRanges.due.start.isInPast }
    @computed get isVisibleToStudents() { return this.isPublished && this.isOpen; }


    @computed get isPollable() {
        return Boolean(
            !this.failed_at &&
                !this.killed_at &&
                this.is_publishing &&
                this.publish_job_url
        );
    }


    @computed get exerciseIds() {
        return uniq(map(this.settings.exercises, 'id'));
    }

    @computed get exercises() {
        return compact(this.exerciseIds.map(exId => this.exercisesMap.get(exId)));
    }

    @computed get isEveryExerciseMultiChoice() {
        return this.exercises.length && every(this.exercises, 'isMultiChoice');
    }

    @computed get questionsInfo() {

        return flatMap(this.exercises, (exercise:Exercise, exerciseIndex:number) => (
            exercise.content.questions.map((question, questionIndex) => {
                const points = (this.settings.exercises?.[exerciseIndex]?.points[questionIndex]) || 0;
                return new QuestionInfo({
                    key: `${exerciseIndex}-${questionIndex}`,
                    question, exercise, exerciseIndex, questionIndex, plan: this,
                    availablePoints: points,
                    points,
                });
            })
        ));
    }

    @action reset() {
        this.title = this.description = '';
        this.tasking_plans.clear()
        this.course.periods.active.forEach(period => {
            this.tasking_plans.push({ target_id: period.id, target_type: 'period' } as TaskingPlan)
        });

    }

    @computed get publishedStatus() {
        if (this.isPublished) return 'published';
        if (this.is_draft) return 'draft';
        if (this.isPublishing) return 'publishing';
        return 'unknown';
    }

    @computed get hasTaskingDatesChanged() {
        return Boolean(
            get(this.unmodified_plans, 'length', 0) != get(this.tasking_plans, 'length', 0) ||
                find(this.unmodified_plans, (a, i) => {
                    const b = this.tasking_plans[i];
                    return !moment(a.opens_at).isSame(b.opens_at) ||
                        !moment(a.due_at).isSame(b.due_at);
                })
        );
    }

    @computed get canEdit() {
        return !this.isVisibleToStudents;
    }

    @computed get pageIds(): ID[] {
        return get(this, 'settings.page_ids', []);
    }

    @computed get assignedSections() {
        return compact(this.pageIds.map(pgId => this.course.referenceBook.pages.byId.get(pgId)));
    }

    @action addExercise(ex: Exercise) {
        if (!this.exerciseIds.find(exId => exId == ex.id)) {
            this.settings.exercises?.push({
                id: ex.id,
                points: map(ex.content.questions, question => question.isOpenEnded ? 2.0 : 1.0),
            });
        }
    }

    includesExercise(exercise: Exercise) {
        return Boolean(
            this.isHomework && this.exerciseIds.includes(exercise.id)
        );
    }

    @computed get clonedAttributes() {
        return extend(pick(
            this,
            'description', 'title', 'type', 'ecosystem_id', 'is_feedback_immediate', 'grading_template_id'
        ), {
            tasking_plans: map(this.tasking_plans, 'clonedAttributes'),
            settings: this.canEdit ? this.settings : null,
        });
    }

    @action createClone({ course }: { course: Course }) {
        return hydrateModel(TeacherTaskPlan, {
            ...this.clonedAttributes,
            course,
            cloned_from_id: this.id,
            tasking_plans: course.periods.active.map(period => ({
                target_id: period.id,
                target_type: 'period',
            })),
        });
    }

    @computed get dataForSave() {
        let data = extend(
            this.clonedAttributes,
            pick(this, 'is_publish_requested', 'cloned_from_id'),
            { tasking_plans: map(this.tasking_plans, 'dataForSave') },
        );
        // Use identity no-op to filter out undefined/null properties
        return pickBy(data, identity);
    }

    @computed get isExternalUrlValid() {
        return Boolean(
            !this.isExternal ||
                (this.settings.external_url && isUrl(this.settings.external_url))
        );
    }

    @computed get invalidParts() {
        const parts = [];
        if (!String(this.title).match(/\w/)) { parts.push('title'); }
        if (isEmpty(this.tasking_plans) || !every(this.tasking_plans, 'isValid')) {
            parts.push('taskings');
        }
        if (this.isReading && isEmpty(this.pageIds)) { parts.push('readings'); }
        if (this.isHomework && isEmpty(this.exerciseIds)) { parts.push('homeworks'); }
        if (!this.isExternalUrlValid){ parts.push('external_url'); }

        return parts;
    }

    @computed get isValid() {
        return 0 === this.invalidParts.length;
    }

    @computed get droppedQuestionsSaveData() {
        return this.dropped_questions.map(dq => pick(dq, ['question_id', 'drop_method']))
    }

    async saveDroppedQuestions() {
        const data = await this.api.request<TeacherTaskPlanData>(
            urlFor('saveDroppedQuestions', { taskPlanId: this.id }),
            { data: { dropped_questions: toJS(this.droppedQuestionsSaveData) } },
        )
        this.update(data)
    }

    @computed get activeAssignedPeriods() {
        const ids = compact(this.tasking_plans.map(tp => tp.target_type == 'period' && tp.target_id));
        return filter(
            this.course.periods.sorted, p => includes(ids, p.id)
        );
    }

    async save() {
        const data = await this.api.request<TeacherTaskPlanData>(
            this.isNew ?
                urlFor('createTaskPlan', { courseId: this.course.id }) : urlFor('saveTaskPlan', { taskPlanId: this.id }),
            { data: this.dataForSave },
        )
        this.update(data)
    }

    async grantExtensions(extensions: TaskPlanExtensionData[]) {
        //if new extensions dates are selected for a student who has already an extension, this will update the student previous extended dates
        const grantedExtensions = unionBy(extensions, this.extensions, 'role_id');
        const updatedExtensions = this.api.request<TaskPlanExtensionData[]>(
            urlFor('grantTaskExtensions', { taskPlanId: this.id }),
            { data: { extensions: grantedExtensions } },
        )
        return updatedExtensions
    }


    @override update(data: TeacherTaskPlanData) {
        this.api.errors.clear()
        super.update(data)
        this.is_publish_requested = false;
        this.unmodified_plans = data.tasking_plans;
    }

    async fetch() {
        const plan = await this.api.request<TeacherTaskPlanData>(urlFor('fetchTaskPlan', { taskPlanId: this.id }))
        this.update(plan)
    }

    @action async destroy() {
        this.is_deleting = true;
        await this.api.request(urlFor('deleteTaskPlan', { taskPlanId: this.id }))
        this.onDeleteComplete()
    }

    @action onDeleteComplete() {
        this.is_deleting = false;
        this.course.teacherTaskPlans.delete(this.id);
    }

    isValidCloseDate(taskings: TaskingPlan[], date: Time) {
        if (date.isAfter(this.course.ends_at)) {
            return true;
        }
        return !!taskings.find(tasking => {
            return date.isBefore(tasking.dueAt);
        });
    }

}
