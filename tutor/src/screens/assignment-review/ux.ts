import { React, observable, action, computed, modelize, hydrateModel } from 'vendor';
import { first, pick, sortBy, filter, sumBy, get, find } from 'lodash';
import ScrollTo from '../../helpers/scroll-to';
import { ID, NEW_ID } from 'shared/model'
import {
    DroppedQuestion, CoursePeriod, TaskPlanScores, Course,
    TaskingPlan, TaskPlanScoresTasking, TaskPlanScoreHeading,
    TaskPlanScoreStudent,
} from '../../models';
import EditUX from '../assignment-edit/ux';
import rowDataSorter from './scores-data-sorter';
import scrollIntoView from 'scroll-into-view';
import { runInAction } from 'mobx';
import DetailsBody from '../assignment-edit/details-body';
import { History } from 'history';
import ExerciseQuestion from 'shared/model/exercise/question';

interface DroppedChanged {
    dropped: {
        isChanged: true
    }
}
function isDroppedChanged(h: any): h is DroppedChanged {
    return h && h.dropped && h.dropped.isChanged
}

export default class AssignmentReviewUX {

    @observable selectedPeriod?: CoursePeriod;
    @observable exercisesHaveBeenFetched = false;
    @observable displayingDropQuestion: ExerciseQuestion|null = null
    @observable isDisplayingGrantExtension = false;
    @observable isDisplayingConfirmDelete = false;
    @observable isDisplayingEditAssignment = false;
    @observable isDeleting = false;
    @observable editUX: any;
    @observable editablePlan: any;
    @observable rowSort = { key: 0, asc: true, dataType: 'name' };
    @observable searchingMatcher: RegExp|null = null;
    @observable searchingExtensionsMatcher: RegExp|null = null;
    @observable reverseNameOrder = false;
    @observable displayTotalInPercent = false;
    @observable hideStudentsName = false;
    @observable id:ID = NEW_ID
    history!: History
    planScores!: TaskPlanScores
    scroller!: ScrollTo
    course!: Course
    onCompleteDelete!: (_date: string) => void
    onEditAssignment!: () => void
    onTabSelection!: () => void
    params: any

    freeResponseQuestions = observable.map();
    @observable pendingExtensions = observable.map();
    pendingDroppedQuestions = observable.map();

    constructor(attrs:any = null) {
        modelize(this);
        if (attrs) { this.initialize(attrs); }
    }

    @action async initialize({
        id, course, onCompleteDelete, onEditAssignment, onTabSelection, history, periodId,
        scores = course.teacherTaskPlans.withPlanId(id).scores,
        windowImpl = window,
        tab = 0,
    }: any) {
        this.id = id;
        this.history = history;
        this.scroller = new ScrollTo({ windowImpl } as any);
        this.planScores = scores;
        this.course = course;
        this.onCompleteDelete = onCompleteDelete;
        this.onEditAssignment = onEditAssignment;
        this.onTabSelection = onTabSelection;

        const currentTab = parseInt(tab, 10);
        // default tab index is 0
        if(currentTab > 0) {
            onTabSelection(currentTab);
        }

        await this.planScores.fetch();
        await this.planScores.taskPlan.fetch();
        await this.planScores.taskPlan.analytics.fetch();
        runInAction(() => {
            const period = find(this.assignedPeriods, p => p.id == periodId);
            this.selectedPeriod = period ? period : first(this.assignedPeriods);
        })
        await this.planScores.ensureExercisesLoaded();
        await this.course.referenceBook.ensureLoaded();
        runInAction(() => {
            this.exercisesHaveBeenFetched = true;
            this.freeResponseQuestions.set(get(this.scores, 'questionsInfo[0].id'), true);
        })
    }

    @computed get isExercisesReady() { return this.exercisesHaveBeenFetched; }
    @computed get planId() { return this.planScores.id; }

    @computed get isScoresReady() {
        return Boolean(this.selectedPeriod);
    }


    @action.bound setSelectedPeriod(period: CoursePeriod) {
        this.selectedPeriod = period;
    }

    @computed get hasEnrollments() {
        return Boolean(this.selectedPeriod && this.selectedPeriod.hasEnrollments);
    }

    @computed get scores(): TaskPlanScoresTasking | null {
        if (!this.selectedPeriod) { return null; }
        return this.planScores.tasking_plans.find(tp => this.selectedPeriod?.id == tp.period_id) || null;
    }

    @computed get taskingPlan(): TaskingPlan | null {
        if (!this.selectedPeriod) { return null; }
        return this.planScores.taskPlan.tasking_plans.forPeriod(this.selectedPeriod) || null;
    }

    @computed get taskPlan() {
        return this.planScores.taskPlan;
    }

    @computed get assignedPeriods() {
        return this.taskPlan.activeAssignedPeriods;
    }

    @computed get activeScoresStudents() {
        return this.scores?.students.active || []
    }

    // methods relating to sorting and filtering scores table

    @computed get sortedStudents() {
        const students = rowDataSorter(this.activeScoresStudents, this.rowSort);
        if (!this.searchingMatcher) {
            return students;
        }
        return filter(students, s => s.name.match(this.searchingMatcher));
    }

    @computed get extensionStudents() {
        const students = rowDataSorter(
            this.activeScoresStudents,
            { key: 0, asc: true, dataType: 'first_name' }
        );
        if (!this.searchingExtensionsMatcher) {
            return students;
        }
        return filter(students, s => s.name.match(this.searchingExtensionsMatcher));
    }

    @action.bound changeRowSortingOrder(key: number, dataType: string) {
        this.rowSort.asc = this.rowSort.key === key ? (!this.rowSort.asc) : false;
        this.rowSort.key = key;
        this.rowSort.dataType = dataType;
    }

    isRowSortedBy({ sortKey, dataType }: { sortKey: number, dataType: string }) {
        return (this.rowSort.key === sortKey) && (this.rowSort.dataType === dataType);
    }

    sortForColumn(sortKey: number, dataType: string) {
        return (this.rowSort.key === sortKey) && (this.rowSort.dataType === dataType) ? this.rowSort : false;
    }

    @action.bound toggleNameOrder() {
        this.reverseNameOrder = !this.reverseNameOrder;
    }

    @computed get nameOrderHeader() {
        return this.reverseNameOrder ? 'Firstname, Lastname' : 'Lastname, Firstname';
    }

    isShowingFreeResponseForQuestion(question: ExerciseQuestion) {
        return Boolean(this.freeResponseQuestions.get(question.id));
    }

    @action.bound toggleFreeResponseForQuestion(question: ExerciseQuestion) {
        this.freeResponseQuestions.set(question.id, !this.isShowingFreeResponseForQuestion(question));
    }

    @action.bound onSearchStudentChange({ target: { value } }: React.ChangeEvent<HTMLInputElement>) {
        this.searchingMatcher = value ? RegExp(value, 'i') : null;
    }

    @action.bound onSearchExtensionStudentChange({ target: { value } }: React.ChangeEvent<HTMLInputElement>) {
        this.searchingExtensionsMatcher = value ? RegExp(value, 'i') : null;
    }

    // methods relating to granting extensions

    @computed get isPendingExtensions() {
        // find any values that are truthy
        for (const value of this.pendingExtensions.values()) {
            if (value) { return true; }
        }
        return false;
    }

    @computed get hideToggleGrantExtensionAllStudents() {
        return this.activeScoresStudents.length != this.extensionStudents.length;
    }

    @action.bound toggleGrantExtensionAllStudents({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) {
        this.extensionStudents.forEach(s => {
            this.pendingExtensions.set(s.role_id.toString(10), checked);
        });
    }

    @computed get allExtensionStudentsSelected() {
        const values = Array.from(this.pendingExtensions.values());
        return filter(values, v => v).length == this.activeScoresStudents.length;
    }

    @action.bound cancelDisplayingGrantExtension() {
        this.pendingExtensions.clear();
        this.isDisplayingGrantExtension = false;
    }

    @action.bound async saveDisplayingGrantExtension(values: any) {
        const due_at = values.extension_due_date.format();
        const closes_at = values.extension_close_date.format();
        const extensions: any[] = [];
        this.pendingExtensions.forEach((extend, role_id) => {
            if (extend) {
                extensions.push({ role_id, due_at, closes_at });
            }
        });
        if (extensions.length > 0) {
            await this.taskPlan.grantExtensions(extensions);
        }
        await this.planScores.fetch();
        this.cancelDisplayingGrantExtension();
    }

    wasGrantedExtension(role_id: ID) {
        return Boolean(
            this.taskPlan.extensions.length > 0 && this.taskPlan.extensions.find(e => e.role_id == role_id)
        );
    }

    // Methods relating to droppping questions
    // TODO: Broken by drop any heading changes (headings can now have multiple dropped questions)
    //       Maybe remove these since we are changing how questions are dropped

    @action toggleDropQuestion(isDropped: boolean, { question_id }: {question_id: ID}) {
        if (isDropped) {
            this.pendingDroppedQuestions.set(question_id, hydrateModel(DroppedQuestion, { question_id }));
        } else {
            this.pendingDroppedQuestions.delete(question_id);
        }
    }

    @action displayDropQuestion(question: ExerciseQuestion) {
        this.displayingDropQuestion = question
    }

    @action.bound cancelDisplayingDropQuestions() {
        this.pendingDroppedQuestions.clear();
        this.changedDroppedQuestions.forEach(dq => (dq.dropped as any).isChanged = false);
        this.displayingDropQuestion = null
    }

    @action.bound async saveDropQuestions() {
        const { taskPlan } = this;

        this.pendingDroppedQuestions.forEach(dq => {
            taskPlan.dropped_questions.push(dq);
            this.planScores.dropped_questions.push(dq);
        });

        // Existing dropped Qs need to be updated to pick up allocation changes
        this.changedDroppedQuestions.forEach(h => {
            const { question_id, drop_method } = h.dropped || {};
            const dropped = taskPlan.dropped_questions.find(dq => dq.question_id == question_id)
            if (dropped) {
                dropped.drop_method = drop_method;
            }

        });

        await taskPlan.saveDroppedQuestions();
        await this.planScores.fetch();
        this.cancelDisplayingDropQuestions();
    }

    droppedQuestionRecord(heading: TaskPlanScoreHeading) {
        return Boolean(heading.dropped || this.pendingDroppedQuestions.get(heading.question_id));
    }

    @computed get changedDroppedQuestions(): (TaskPlanScoreHeading & DroppedChanged)[] {
        return this.scores?.question_headings.filter(isDroppedChanged) as any || [];
    }

    @computed get canSubmitDroppedQuestions() {
        return Boolean(
            this.changedDroppedQuestions.length > 0 ||
      this.pendingDroppedQuestions.size > 0
        );
    }

    @computed get isDroppedQuestionsSaving() {
        return this.taskPlan.api.isInProgress('saveDroppedQuestions')
    }

    @action.bound onDelete() {
        this.isDisplayingConfirmDelete = true;
    }

    @action.bound async onConfirmDelete() {
        const { taskPlan } = this.planScores;
        const date = taskPlan.dateRanges.opens.start.format('YYYY-MM-DD');
        this.isDeleting = true;
        await taskPlan.destroy();
        this.onCompleteDelete(date);
    }

    @action.bound onCancelDelete() {
        this.isDisplayingConfirmDelete = false;
    }

    @action.bound async onEditPlan() {
        if (this.taskPlan.isOpen) {
            await this.taskPlan.fetch();

            this.editUX = new EditUX();

            await this.editUX.initialize({
                ...this.params,
                id: this.taskPlan.id,
                history,
                course: this.course,
            });

            runInAction(() => this.isDisplayingEditAssignment = true );

        } else {
            this.onEditAssignment();
        }
    }

    @action.bound onCancelEdit() {
        this.isDisplayingEditAssignment = false;
    }

    @action.bound async onSavePlan() {
        await this.editUX.savePlan();
        runInAction(() => {
            Object.assign(this.planScores, pick(this.editUX.plan, ['title', 'description']));
            this.planScores.grading_template = this.editUX.plan.gradingTemplate;
            this.isDisplayingEditAssignment = false;
        })
    }

    @action.bound renderDetails(form:any) {
        this.editUX.form = form;
        return React.createElement(DetailsBody, { ux: this.editUX })
    }

    @action.bound async onPublishScores() {
        await this.taskingPlan?.publishScores();
        await this.planScores.fetch();
        await this.planScores.taskPlan.fetch();
        await this.planScores.taskPlan.analytics.fetch();
        await this.planScores.ensureExercisesLoaded();
    }

    @action.bound toogleNameVisibility() {
        this.hideStudentsName = !this.hideStudentsName;
    }

    @computed get isPublishingScores() {
        return Boolean(
            this.taskingPlan && this.taskingPlan.api.isPending
        );
    }

    @computed get submitPending() {
        return Boolean(
            this.editUX.plan.api.isPending
        );
    }

    @computed get canSubmit() {
        return Boolean(
            this.editUX.validations.isValid
        );
    }

    @computed get areTaskingDatesSame() {
        return Boolean(
            this.planScores.taskPlan.areTaskingDatesSame
        );
    }

    @computed get taskingPlanDetails() {
        return this.areTaskingDatesSame ?
            [first(this.planScores.taskPlan.tasking_plans)] :
            sortBy(this.planScores.taskPlan.tasking_plans, tp => tp.period?.name);
    }

    @computed get stats() {
        return this.planScores.taskPlan.analytics.stats;
    }

    @computed get progressStatsForPeriod() {
        // period stats will be undefined if no-ones worked the assignment in the period yet
        const periodStats = this.stats.find(s => s.period_id == this.selectedPeriod?.id);
        const { total_count = 0, complete_count = 0, partially_complete_count = 0 } = periodStats || { };
        const notStartedCount = total_count - (complete_count + partially_complete_count);

        const items = [
            { label: 'Completed',
                value: complete_count,
                percent: (complete_count / total_count),
            },
            { label: 'In progress',
                value: partially_complete_count,
                percent: (partially_complete_count / total_count),
            },
            { label: 'Not started',
                value: notStartedCount,
                percent: (notStartedCount / total_count),
            },
        ];

        return items;
    }

    @computed get canDisplayGradingBlock() {
        return Boolean((this.planScores.isHomework || this.planScores.isReading) && this.scores);
    }

    @computed get canDisplayGradingButton() {
        return Boolean(this.taskingPlan?.isPastDue && this.scores?.hasAnyResponses);
    }

    @computed get hasUnPublishedScores() {
        return Boolean(this.taskingPlan?.isPastDue && this.scores?.hasUnPublishedScores);
    }

    @computed get gradeableQuestionCount() {
        return sumBy(this.scores?.question_headings.map(qh => qh.gradedStats), 'remaining');
    }

    @computed get hasGradeableAnswers() {
        return Boolean(this.gradeableQuestionCount > 0);
    }

    @action.bound scrollToQuestion(questionId: ID, index: number) {
        this.freeResponseQuestions.set(get(this.scores, `questionsInfo[${index}].id`), true);
        scrollIntoView(document.querySelector<HTMLDivElement>(`[data-question-id="${questionId}"]`)!, {
            time: 300,
            align: { top: 0, topOffset: 80 },
        });
    }

    getReadingCountData(student: TaskPlanScoreStudent) {
        const completedQuestions = filter(student.questions, 'is_completed');
        return {
            total: student.questions.length,
            complete: completedQuestions.length,
            correct: filter(completedQuestions, cq => cq.is_correct).length,
            incorrect: filter(completedQuestions, cq => !cq.is_correct).length,
        };
    }

    didStudentComplete(student?: TaskPlanScoreStudent) {
        if(!student) {
            return false;
        }
        const data = this.getReadingCountData(student);
        return data.complete === data.total;
    }

    isStudentAboveFiftyPercentage(student?: TaskPlanScoreStudent) {
        if(!student) {
            return false;
        }
        return student.total_fraction >= 0.5;
    }

    getStudentName(student: TaskPlanScoreStudent) {
        return this.hideStudentsName ? 'Student response' : student.name;
    }
}
