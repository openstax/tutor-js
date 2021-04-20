import { React, observable, computed, action, modelize } from 'vendor';
import Router from '../../helpers/router';
import { runInAction, observe } from 'mobx';
import ScrollTo from '../../helpers/scroll-to';
import {
    filter, isEmpty, compact, map, get, first, difference, flatMap, omit, pick, extend, every,
} from 'lodash';
import { TASK_PLAN_SELECTION_COUNTS } from '../../config'
import {
    currentExercises, TeacherTaskPlan as TaskPlan, ReferenceBook, Time,
} from '../../models';
import { StepUX, Step } from './step';
import { Actions } from './actions';
import Validations from './validations';
import moment from '../../helpers/moment-range';
import DetailsBody from './details-body';


const WRM_START_DATE = new Date('2020-06-18');
const TEMPLATEABLE_TYPES = ['homework', 'reading'];

export default class AssignmentUX {

    @observable isShowingSectionSelection = false;
    @observable isShowingExerciseReview = false;
    @observable isShowingPeriodTaskings;
    @observable isShowingAddTemplate = false;
    @observable isShowingConfirmTemplate = false;
    @observable exercises;
    @observable filteredExercises;
    @observable isReady = false;
    @observable form;
    @observable templates;
    @observable plan;
    @observable didUserChangeDatesManually = false;
    @observable dueAt;

    constructor(attrs = null) {
        modelize(this);
        if (attrs) { this.initialize(attrs); }
    }

    @action async initialize({
        id, type, plan, course, history, due_at, step,
        gradingTemplates = course.gradingTemplates,
        exercises = currentExercises,
        windowImpl = window,
    }) {
        if ('clone' === type) {
            if (!course.pastTaskPlans.api.hasBeenFetched) {
                await course.pastTaskPlans.fetch();
            }
            this.plan = plan || course.pastTaskPlans.get(id).createClone({ course });
        } else {
            if (plan) {
                this.plan = plan;
            } else {
                this.plan = new TaskPlan({ id, course, type });
                if (id && id != 'new') {
                    const existing = course.teacherTaskPlans.get(id);
                    if (existing) {
                        this.plan.update( existing.toJSON() );
                    }
                }
            }
            if (type) {
                this.plan.type = type;
            }
        }
        this.course = course;
        this.dueAt = due_at;

        if (this.plan.isNew) {
            if (this.plan.isExternal || this.plan.isEvent) {
                this.setExternalAndEventDates(due_at);
            } else {
                this.periods.map((period) =>
                    this.plan.findOrCreateTaskingForPeriod(period),
                );
            }
        } else {
            await this.plan.ensureLoaded();
        }

        observe(this.plan, 'grading_template_id', this.onGradingTemplateUpdate);

        if (this.canSelectTemplates) {
            // once templates is loaded, select ones of the correct type
            await gradingTemplates.ensureLoaded();
            this.templates = gradingTemplates;
            this.plan.grading_template_id =
                // if cloning, set the grading_template_id to the current ones from copied course.
        type === 'clone' || !this.plan.grading_template_id
            ? get(this.gradingTemplates, '[0].id')
            : this.plan.grading_template_id;
        }

        this.history = history;
        this.exercises = exercises;
        this.filteredExercises = exercises;
        // task plans can't contain "foreign" exercises
        // We must clear out the exercises cache so that exercises
        // that belong to other ecosystems aren't present.
        this.exercises.clear({ exceptIds: this.plan.exerciseIds });
        this.windowImpl = windowImpl;

        this.isShowingPeriodTaskings = !(this.canSelectAllSections && this.plan.areTaskingDatesSame);

        this.scroller = new ScrollTo({ windowImpl });

        // don't setup additional helpers until fully initialized
        this.validations = new Validations(this);
        this.steps = new StepUX(this, step);
        this.actions = new Actions(this);

        this.isReady = true;
    }

    setExternalAndEventDates(due_at) {
        // due_at is defined if user creates an assignment through the calendar
        if (due_at) {
            this.periods.map((period) =>
                this.plan.findOrCreateTaskingForPeriod(period)
            );
            this.plan.tasking_plans.forEach(tp => {
                tp.initializeWithDueAt({ dueAt: due_at, defaultOpenTime: '00:01', defaultDueTime: '21:00' });
                tp.opens_at = moment(tp.due_at).subtract('7', 'day').toISOString();
                tp.closes_at = moment(tp.due_at).add(1, 'minute').toISOString();
            });
        }
        else {
            const now = moment(Time.now);
            let default_opens_at;
            // If a semester hasn’t started at the time of assignment creation then the default open date should be first day of the semester at 12:01 AM
            // else current time at 12:01am
            if(now.isBefore(this.course.bounds.start)) {
                const courseStartDate = this.course.bounds.start;
                default_opens_at = courseStartDate.startOf('day').add(1, 'minute').toISOString();
            }
            else
                default_opens_at = moment(Time.now).add(1, 'day').startOf('day').add(1, 'minute').toISOString();
            // default due date is 7 days after open date
            const default_due_at = moment(default_opens_at).add(7, 'day').toISOString();
            // if adding external assignment, close date is 1 minute after due date
            if(this.plan.isExternal) {
                const external_default_close_at = moment(default_due_at).add(1, 'minute').toISOString();
                this.periods.map((period) =>
                    this.plan.findOrCreateTaskingForPeriod(period, { opens_at: default_opens_at, due_at: default_due_at, closes_at: external_default_close_at }),
                );
            }
            // event does not have a close date. Need to set the closes_at the same as due_at
            else {
                this.periods.map((period) =>
                    this.plan.findOrCreateTaskingForPeriod(period, { opens_at: default_opens_at, due_at: default_due_at, closes_at: default_due_at }),
                );
            }
        }
    }

    @action.bound onGradingTemplateUpdate({ newValue }) {
        // Change the ux dates when the template of the plan is changed
        if(this.plan.isNew) {
            // Apply updated grading template settings to tasking plans whenever it changes.
            //const previousTemplate = this.course.gradingTemplates.get(oldValue);
            const template = this.course.gradingTemplates.get(newValue);
            this.plan.tasking_plans.forEach(tp => tp.onGradingTemplateUpdate(template, this.dueAt));
            // Apply the updated dates based on the grading template to the form
            this.plan.tasking_plans.forEach((t, index) => {
                if(this.form) {
                    this.form.setFieldValue(`tasking_plans[${index}].opens_at`, t.opens_at);
                    this.form.setFieldValue(`tasking_plans[${index}].due_at`, t.due_at);
                    // Setting up new close date (base on due date)
                    this.form.setFieldValue(`tasking_plans[${index}].closes_at`, t.closes_at);
                    this.didUserChangeDatesManually = false;
                }
            });
        }
    }

    @computed get gradingTemplates() {
        return(filter(this.templates.array, t => t.task_plan_type == this.plan.type));
    }

    @computed get gradingTemplate() {
        return (
            this.course.gradingTemplates.array.find(t => t.id == this.form.values.grading_template_id)
        );
    }

    @computed get canSelectAllSections() {
        return Boolean(
            this.plan.isEditable && isEmpty(difference(
                map(this.course.periods.active, 'id'),
                map(this.plan.tasking_plans, 'target_id'),
            ))
        );
    }

    @computed get canSelectTemplates() {
        return TEMPLATEABLE_TYPES.includes(this.plan.type);
    }

    @computed get canAddTemplate() {
        // Prevent showing add template modal when editing in review
        return this.plan.isNew;
    }

    @computed get canInputExternalUrl() {
        return this.plan.type === 'external';
    }

    @computed get periods() {
        return filter(this.course.periods.sorted, 'isActive');
    }

    @computed get isInitializing() {
        return !this.isReady || !this.plan || this.plan.api.isPendingInitialFetch;
    }

    get referenceBook() {
        if (this._referenceBook) {
            return this._referenceBook;
        }
        if (this.plan.ecosystem_id && this.plan.ecosystem_id != this.course.ecosystem_id) {
            this._referenceBook = new ReferenceBook({ id: this.plan.ecosystem_id });
        } else {
            this._referenceBook = this.course.referenceBook;
        }
        return this._referenceBook;
    }

    @action.bound renderStep(form) {
        this.form = form;
        return <Step ux={this} />;
    }

    @action.bound renderMiniCloneEditor(form) {
        this.form = form;
        return <DetailsBody ux={this} />;
    }

    @action.bound navigateToStep(index) {
        this.history.push(
            Router.makePathname('editAssignment', {
                courseId: this.course.id,
                type: this.plan.type,
                id: this.plan.id || 'new',
                step: index,
            })
        );
    }

    @action.bound onComplete() {
        this.history.push(`/course/${this.course.id}`);
    }

    @action.bound onCancel() {
        this.onComplete();
    }

    @action.bound onSelectTemplate(templateId) {
        if (this.plan.isNew) {
            this.setTemplateId(templateId);
        } else {
            this.newTemplateId = templateId;
            this.isShowingConfirmTemplate = true;
        }
    }

    @action.bound onConfirmTemplate() {
        this.setTemplateId(this.newTemplateId);
        this.isShowingConfirmTemplate = false;
    }

    @action.bound onCancelConfirmTemplate() {
        this.isShowingConfirmTemplate = false;
    }

    @action.bound setTemplateId(templateId) {
        this.form.setFieldValue('grading_template_id', templateId);
        this.plan.grading_template_id = templateId;
    }

    get formValues() {
        return this.plan.toJSON();
    }

    @computed get isApiPending() {
        return this.plan.api.isPending;
    }

    @computed get canEdit() {
        return this.plan.canEdit;
    }

    @computed get selectedPageIds() {
        return this.plan.pageIds;
    }

    @computed get selectedChapterSections() {
        return filter(map(this.selectedPages, 'chapter_section'), 'isPresent');
    }

    @computed get selectedPages() {
        return this.selectedPageIds.map(pgId => this.referenceBook.pages.byId.get(pgId));
    }

    @action.bound onSectionIdsChange(ids) {
        this.plan.settings.page_ids = ids;
    }

    @action.bound togglePeriodTasking({ target: input }) {
        const period = this.plan.course.periods.find(p => p.id == input.dataset.periodId);
        if (!period) { return; }

        const tasking = this.plan.tasking_plans.forPeriod(period);

        if (input.checked && !tasking) {
            const defaultAttrs = { dueAt: this.dueAt };
            const firstTp = first(this.plan.tasking_plans);
            if (firstTp) {
                extend(defaultAttrs, pick(firstTp, 'opens_at', 'due_at', 'closes_at'));
            }
            this.plan.findOrCreateTaskingForPeriod(period, defaultAttrs);
        } else if (!input.checked && tasking) {
            this.plan.tasking_plans.remove(tasking);
        }
    }

    @action.bound togglePeriodTaskingsEnabled(ev) {
        this.isShowingPeriodTaskings = ev.target.value == 'periods';
        this.periods.map(period => this.plan.findOrCreateTaskingForPeriod(period, { dueAt: this.dueAt }));
    }

    @action.bound onExerciseToggle(event, exercise) {
        const ex = exercise.wrapper;
        ex.isSelected = !ex.isSelected;
        ex.isSelected ? this.plan.addExercise(ex) : this.plan.removeExercise(ex);
    }

    @computed get isFetchingExercises() {
        return this.exercises.isFetching({ pageIds: this.selectedPageIds });
    }

    @computed get selectedExercises() {
        if (isEmpty(this.exercises)) { return []; }
        return compact(map(this.plan.exerciseIds, exId => (
            this.exercises.get(exId)
        )));
    }

    @computed get numTutorSelections() {
        return get(this.plan, 'settings.exercises_count_dynamic', 0);
    }

    @action.bound increaseTutorSelection() {
        if (this.canIncreaseTutorExercises) {
            this.plan.settings.exercises_count_dynamic = this.numTutorSelections + 1;
        }
    }

    @action.bound decreaseTutorSelection() {
        if (this.canDecreaseTutorExercises) {
            this.plan.settings.exercises_count_dynamic = this.numTutorSelections - 1;
        }
    }

    @computed get canIncreaseTutorExercises() {
        return this.canEdit && this.numTutorSelections < TASK_PLAN_SELECTION_COUNTS.max;
    }

    @computed get canDecreaseTutorExercises() {
        return this.canEdit && this.numTutorSelections > TASK_PLAN_SELECTION_COUNTS.min;
    }

    @computed get numMCQs() {
        return flatMap(filter(this.plan.exercises, 'isMultiChoice'), 'content.questions').length;
    }

    @computed get numWRQs() {
        return flatMap(filter(this.plan.exercises, 'isOpenEnded'), 'content.questions').length;
    }

    @computed get numExerciseSteps() {
        return this.numMCQs + this.numWRQs;
    }

    @computed get totalSelections() {
        return this.numExerciseSteps + this.numTutorSelections;
    }

    isExerciseSelected(ex) {
        return this.selectedExercises.includes(ex);
    }

    @computed get displayedExercises() {
        return this.filteredExercises.where(ex => (
            this.isExerciseSelected(ex) || (
                ex.isHomework && ex.isAssignable &&
        ex.page && this.selectedPageIds.includes(ex.page.id)
            )
        ));
    }

    @computed get canSaveAsDraft() {
        return !this.plan.isPublished && this.form.values.title.trim() && this.plan.tasking_plans.areValid();
    }

    @action.bound async onSaveAsDraftClick() {
        await this.saveAsDraft();
        this.onComplete();
    }

    @action saveFormToPlan() {
        this.plan.update(omit(this.form.values, 'tasking_plans', 'settings'));
        if (this.plan.isExternal) {
            this.plan.settings.external_url = this.form.values.settings.external_url;
        }
    }

    @action.bound async saveAsDraft() {
        this.saveFormToPlan();
        this.plan.is_draft = true;
        await this.saveAndCopyPlan();
    }

    @action.bound async savePlan() {
        this.saveFormToPlan();
        this.plan.is_draft = false;
        if (!this.plan.is_published) {
            this.plan.is_publish_requested = true;
        }
        await this.saveAndCopyPlan();
    }

    @action.bound async onPublishClick() {
        await this.savePlan();
        this.onComplete();
    }

    @action async saveAndCopyPlan() {
        await this.plan.save();
        await runInAction(() => {
            const destPlan = this.course.teacherTaskPlans.withPlanId(this.plan.id);
            destPlan.update(this.plan.serialize());

            // if cloning an assignment from previous course, delete the assignment after it was saved as draft, or published
            if(this.plan.isClone) {
                this.course.pastTaskPlans.delete(destPlan.cloned_from_id);
            }
        });
    }

    @action onFilterHomeworkExercises(ex) {
        this.filteredExercises = ex;
    }

    @action.bound onShowAddTemplate() {
        this.isShowingAddTemplate = true;
    }

    @action.bound onHideAddTemplate() {
        this.isShowingAddTemplate = false;
    }

    @action setDidUserChangeDatesManually(didChange) {
        this.didUserChangeDatesManually = didChange;
    }

    @action setDueAt(dueAt) {
        this.dueAt = dueAt;
    }

    @action.bound async onDelete() {
        await this.plan.destroy();
        this.onComplete();
    }

    @computed get showPreWRMCloneHelp() {
        if (!(this.plan.isClone && this.plan.isHomework)) { return false; }
        const clonedFrom = this.course.pastTaskPlans.get(this.plan.cloned_from_id);
        return Boolean(clonedFrom && clonedFrom.duration.start.isBefore(WRM_START_DATE));
    }

    @computed get canEditSettings() {
        return this.plan.isNew || every(this.plan.tasking_plans, ['isPastOpen', false]);
    }

    @computed get titleTextLabel() {
        if(this.plan.isEvent) return 'Event name';
        return 'Assignment name';
    }

    @computed get headerTextLabel() {
        if(this.plan.isExternal) return 'external assignment';
        return this.plan.type;
    }
}
