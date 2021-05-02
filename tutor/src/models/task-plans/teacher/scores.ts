import { BaseModel, ID, field, model, modelize, computed, NEW_ID, getParentOf, array } from 'shared/model';
import {
    filter, sumBy, find, isNil, compact, sortBy,
    get, some, reduce, every, uniq, isNumber, isEmpty, groupBy, orderBy,
} from 'lodash';
import ScoresHelper, { UNWORKED, UNGRADED } from '../../../helpers/scores';
import urlFor from '../../../api'
import type {
    TaskPlanType, TeacherTaskPlan,
} from '../../../models'
import {
    DroppedQuestion, GradingTemplate, CoursePeriod, currentExercises,
} from '../../../models'

class TaskPlanScoreStudentQuestion extends BaseModel {
    @field question_id = NEW_ID;
    @field exercise_id:ID = NEW_ID;
    @field is_completed = false;
    @field points = 0;
    @field comments = ''
    @field late_work_point_penalty = 0;
    @field selected_answer_id = 0;
    @field is_correct = false;
    @field free_response = '';
    @field task_step_id: ID = NEW_ID;
    @field needs_grading = false;
    @field grader_points = 0 ;
    @field grader_comments = '';
    @field submitted_late = false;

    constructor() {
        super();
        modelize(this);
    }

    get student() { return getParentOf<TaskPlanScoreStudent>(this) }

    @computed get gradedPoints() {
        return isNil(this.grader_points) ? this.points : this.grader_points;
    }

    @computed get gradedComments() {
        return isNil(this.grader_comments) ? this.comments : this.grader_comments;
    }

    @computed get isPlaceHolder() {
        return !this.exercise_id;
    }

    @computed get index() {
        return this.student.questions.indexOf(this);
    }

    @computed get questionHeading() {
        // First try to find the heading by question_id
        const heading = this.student.tasking.question_headings.find(
            qh => qh.question_id == this.question_id
        );
        if (!isNil(heading)) {
            return heading;
        }

        // For Tutor-assigned questions, each student may get a question with a different ID
        // so we can't really do better than using the index in this case
        if (this.student.tasking.question_headings.length > this.index) {
            return this.student.tasking.question_headings[this.index];
        }

        return null;
    }

    @computed get availablePoints() {
        return get(this.questionHeading, 'points', 1.0);
    }

    @computed get finalPoints() {
        return ScoresHelper.formatPoints(
            get(this, 'gradedPoints', 0.0) - get(this, 'late_work_point_penalty', 0.0)
        );
    }

    @computed get availablePointsWithoutDropping() {
        return get(this.questionHeading, 'points_without_dropping', 0.0);
    }

    @computed get latePenalty() {
        return ScoresHelper.formatLatePenalty(this.late_work_point_penalty);
    }

    @computed get isManuallyGraded() {
        return !isNil(this.grader_points);
    }

    @computed get isTrouble() {
        return !this.needs_grading && !isNil(this.gradedPoints) && (this.gradedPoints / this.availablePoints) < 0.5;
    }

    @computed get isUnattemptedAutoZero() {
        return this.points === 0 && !this.needs_grading && !this.is_completed;
    }

    @computed get displayValue() {
        const { dropped } = this.questionHeading || {};

        if (this.needs_grading) { return UNGRADED; }

        if (dropped && this.is_completed) {
            return ScoresHelper.formatPoints(
                dropped.drop_method == 'full_credit' ? this.availablePoints : 0
            );
        }

        if (!isNil(this.gradedPoints)) {
            return ScoresHelper.formatPoints(this.gradedPoints);
        }

        return UNWORKED;
    }

    /**
   * If question is dropped with full points but student has not attempted the question yet, show 0
   */
    @computed get droppedQuestionPoints() {
        const droppedQuestion = this.questionHeading?.dropped;
        if(droppedQuestion) {
            return droppedQuestion.drop_method == 'zeroed' || !this.is_completed
                ? 0
                : this.availablePointsWithoutDropping;
        }
        return 0;
    }
}

class TaskPlanScoreStudent extends BaseModel {
    @field role_id = NEW_ID;
    @field task_id = NEW_ID;
    @field first_name = '';
    @field last_name = '';
    @field student_identifier = '';
    @field is_dropped = false
    @field is_late = false
    @field available_points = 0
    @field total_points = 0
    @field total_fraction = 0
    @field late_work_point_penalty = 0
    @field grades_need_publishing = false

    @model(TaskPlanScoreStudentQuestion) questions:TaskPlanScoreStudentQuestion[] = [];

    get tasking() { return getParentOf<TaskPlanScoresTasking>(this) }

    constructor() {
        super();
        modelize(this);
    }

    resultForHeading(heading: TaskPlanScoreHeading) {
        return this.questions.length > heading.index ? this.questions[heading.index] : null;
    }

    @computed get name() {
        return `${this.last_name}, ${this.first_name}`;
    }

    @computed get reversedName() {
        return `${this.first_name}, ${this.last_name}`;
    }

    @computed get extension() {
        if(isEmpty(this.tasking.scores.taskPlan.extensions)) return null;
        return this.tasking.scores.taskPlan.extensions.find(ex => ex.role_id == this.role_id);
    }

    @computed get humanTotalFraction() {
        return isNumber(this.total_fraction) ? `${ScoresHelper.asPercent(this.total_fraction)}%` : UNWORKED;
    }

    @computed get humanTotalPoints() {
        return isNumber(this.total_points) ? ScoresHelper.formatPoints(this.total_points) : UNWORKED;
    }

    @computed get humanTotalWithAvailablePoints() {
        if (!isNumber(this.total_points)) { return `${UNWORKED} / ${UNWORKED}`; }
        return `${ScoresHelper.formatPoints(this.total_points)} / ${ScoresHelper.formatPoints(this.available_points)}`;
    }
}

class TaskPlanScoreHeading extends BaseModel {
    @field title = NEW_ID;
    @field exercise_id = NEW_ID;
    @field question_id = NEW_ID;
    @field type = '';
    @field points = 0;
    @field points_without_dropping = 0;
    @field ecosystem_id = NEW_ID;

    exercises = currentExercises

    get tasking() { return getParentOf<TaskPlanScoresTasking>(this) }

    constructor() {
        super();
        modelize(this);
    }
    
    @computed get isCore() {
        return 'Tutor' !== this.type;
    }

    @computed get index() {
        return this.tasking && this.tasking.question_headings.indexOf(this);
    }

    @computed get studentResponses() {
        if (isNil(this.question_id)) {
            // For Tutor-assigned questions, each student may get a question with a different ID
            // so we can't really do better than using the index in this case
            return compact(this.tasking.students.map(s => s.questions[this.index]));
        }
        else {
            return compact(
                this.tasking.students.map(s => s.questions.find(q => q.question_id == this.question_id))
            );
        }
    }

    @computed get exercise() {
        return this.exercises.get(this.exercise_id);
    }

    @computed get question() {
        return this.exercise && this.exercise.content.questions.find(q => q.id == this.question_id);
    }

    @computed get dropped() {
        return this.tasking.scores.dropped_questions.find(drop => drop.question_id == this.question_id);
    }

    @computed get gradedProgress() {
        return `(${this.gradedStats.completed}/${this.gradedStats.total})`;
    }

    @computed get gradedProgressWithUnAttemptedResponses() {
        return `(${this.gradedStatsWithUnAttemptedResponses.completed}/${this.gradedStatsWithUnAttemptedResponses.total})`;
    }

    @computed get responseStats() {
        const responses = this.studentResponses;
        //don't include students who were dropped
        const responsesInAvgs = filter(responses, response => !isNil(response.gradedPoints) && !response.student.is_dropped);
        return {
            completed: filter(responses, 'is_completed').length,
            hasFreeResponse: Boolean(find(responses, 'free_response')),
            availablePoints: this.points,
            averageGradedPoints: sumBy(responsesInAvgs, 'gradedPoints') / responsesInAvgs.length,
            correct: filter(responses, 'is_correct').length,
            averageGradedPointsWithDroppedQuestion: sumBy(responsesInAvgs, 'droppedQuestionPoints') / responsesInAvgs.length,
        };
    }

    @computed get gradedStats() {
        // Filter students who has completed the question
        const studentWithResponses = filter(this.studentResponses, 'is_completed');
        const remaining = filter(studentWithResponses, 'needs_grading').length;
        return {
            total: studentWithResponses.length,
            completed: studentWithResponses.length - remaining,
            remaining,
            complete: remaining == 0,
        };
    }

    @computed get gradedStatsWithUnAttemptedResponses() {
        const remaining = filter(this.studentResponses, 'needs_grading').length;
        return {
            total: this.studentResponses.length,
            completed: this.studentResponses.length - remaining,
            remaining,
            complete: remaining == 0,
        };
    }

    @computed get displayPoints() {
        const { dropped } = this;
        return dropped ?
            (dropped.drop_method == 'zeroed' ? 0 : this.points_without_dropping) : this.points;
    }

    @computed get averageGradedPoints() {
        return this.responseStats.averageGradedPoints;
    }

    @computed get averageGradedPointsWithDroppedQuestion() {
        return this.responseStats.averageGradedPointsWithDroppedQuestion;
    }

    @computed get isTrouble() {
        const { correct, completed } = this.responseStats;
        const remaining = this.gradedStats.remaining > 0;
        return !remaining && completed > 0 && correct / completed < 0.5;
    }

    @computed get humanCorrectResponses() {
        const { correct, completed } = this.responseStats;
        return `${this.gradedStats.remaining > 0 ? UNWORKED : correct} / ${completed}`;
    }

    @computed get displayAverageGradedPoints() {
        return this.dropped ? this.averageGradedPointsWithDroppedQuestion : this.averageGradedPoints;
    }
}

class TaskPlanScoresTasking extends BaseModel {
    @field id = NEW_ID;
    @field period_id: ID = NEW_ID;
    @field period_name = '';
    @field total_fraction = 0;

    exercises = currentExercises

    get scores() { return getParentOf<TaskPlanScores>(this) }

    constructor() {
        super();
        modelize(this);
    }

    @model(TaskPlanScoreHeading) question_headings = array((headings: TaskPlanScoreHeading[]) => ({
        gradable() { return filter(headings, h => h.question && h.question.isOpenEnded); },
        core() { return filter(headings, h => h.type != 'Tutor'); },
    }))

    @model(TaskPlanScoreStudent) students:TaskPlanScoreStudent[] = [];

    @computed get availablePoints() {
        return sumBy(this.question_headings, 'points');
    }

    // this returns all of the questions that were assigned
    // this is trickier than just using the index from headings because tutor assigned questions
    // will be in different order and different students will get different ones
    @computed get questionsInfo() {
        const info = {};
        for (const student of this.students) {
            for (const studentQuestion of student.questions) {
                const exercise = this.exercises.get(studentQuestion.exercise_id);
                if (exercise) {
                    const question = exercise.content.questions?.find(q => q.id == studentQuestion.question_id);
                    if (!question) continue;
                    // while rare, heading will be null if this student received more exercises than others
                    const heading = studentQuestion.questionHeading;
                    const questionInfo = info[question.id] || (info[question.id] = {
                        id: question.id,
                        key: question.id,
                        points: studentQuestion.points,
                        availablePoints: heading ? heading.points : 1.0,
                        averagePoints: heading ? heading.averageGradedPoints : studentQuestion.points,
                        remaining: heading ? heading.gradedStats.remaining : 0,
                        index: studentQuestion.index,
                        isCore: heading?.isCore,
                        exercise,
                        question,
                        responses: [],
                    });
                    questionInfo.responses.push(studentQuestion);
                }
            }
        }

        // add their stats once all the questions are gathered
        return sortBy(Object.values(info).map((qi: any) => {
            for (const answer of qi.question.answers) {
                answer.selected_count = filter(qi.responses, r => r.selected_answer_id == answer.id).length,
                answer.answered_count = qi.responses.length;
            }
            return {
                ...qi,
                hasFreeResponse: !!find(qi.responses, 'free_response'),
                completed: filter(qi.responses, 'is_completed').length,
                points: sumBy(qi.responses, 'points'),
                totalPoints: qi.points * qi.responses.length,
            };
        }), 'index');
    }

    @computed get coreQuestionsInfo() {
        return this.questionsInfo.filter(q => q.isCore);
    }

    @computed get hasEqualTutorQuestions() {
        for (const student of this.students) {
            if (student.questions.length != this.question_headings.length) {
                return false;
            }
        }
        return true;
    }

    @computed get hasUnPublishedScores() {
        return some(this.students, student => student.grades_need_publishing);
    }

    @computed get isManuallyGraded() {
        return this.question_headings.gradable().length > 0;
    }

    @computed get totalAverageScoreInPercent() {
        return isNil(this.total_fraction) ? UNWORKED : `${ScoresHelper.asPercent(this.total_fraction)}%`;
    }

    @computed get allStudentQuestionStatus() {
        return reduce(this.students, (result, student) => {
            student.questions.forEach(question => {
                result.push(question);
            });
            return result;
        }, [] as TaskPlanScoreStudentQuestion[]);
    }

    @computed get wrmQuestions() {
        return filter(this.allStudentQuestionStatus, s => s.questionHeading?.type === 'WRQ');
    }

    @computed get hasWRMQuestions() {
        return this.wrmQuestions.length > 0;
    }

    @computed get hasUngradedQuestions() {
        const questions = this.wrmQuestions;
        return some(questions, q => q.is_completed && q.needs_grading);
    }

    @computed get hasFinishedGrading() {
        const completedWrmQuestions = filter(this.wrmQuestions, s => s.is_completed);
        if(completedWrmQuestions.length <= 0) { return false; }
        return every(completedWrmQuestions, q => !q.needs_grading);
    }

    @computed get hasAnyResponses() {
        const wrmQuestions = this.wrmQuestions;
        return some(wrmQuestions, q => q.is_completed);
    }

    @computed get groupQuestionsByPageTopic() {
        const questions = this.questionsInfo;
        //order the questions by the exercise page's chapter_section so that the first chapters are shown first
        const sortedQuestions = orderBy(questions, ['exercise.page.chapter_section.asNumber'], ['asc']);
        return groupBy(sortedQuestions, q => {
            return q.exercise.page.title;
        });
    }
}

export class TaskPlanScores extends BaseModel {

    @field id = NEW_ID;
    @field title = '';
    @field description = '';
    @field type: TaskPlanType = '';
    @field ecosystem_id: ID = NEW_ID;

    exercises = currentExercises

    get taskPlan() { return getParentOf<TeacherTaskPlan>(this) }

    constructor() {
        super();
        modelize(this);
    }

    @model(DroppedQuestion) dropped_questions:DroppedQuestion[] = []

    @model(TaskPlanScoresTasking) tasking_plans = array((taskings: TaskPlanScoresTasking[]) => ({
        forPeriod(period: CoursePeriod) { return find(taskings, { period_id: period.id }); },
    }))

    @model(GradingTemplate) grading_template?: GradingTemplate;

    @computed get exerciseIds() {
        const ids = this.taskPlan.exerciseIds;
        for (const tasking of this.tasking_plans) {
            for (const student of tasking.students) {
                for (const question of student.questions) {
                    if (!isNil(question.exercise_id)) {
                        ids.push(question.exercise_id);
                    }
                }
            }
        }
        return uniq(ids);
    }

    async ensureExercisesLoaded() {
        if (this.exerciseIds.length) {
            await this.exercises.ensureExercisesLoaded({
                course: this.course, ecosystem_id: this.ecosystem_id, exercise_ids: this.exerciseIds,
            });
        }
    }

    @computed get isHomework() {
        return 'homework' == this.type;
    }

    @computed get isExternal() {
        return 'external' == this.type;
    }

    @computed get isReading() {
        return 'reading' == this.type;
    }

    async fetch() {
        const data = await this.api.request(urlFor('fetchTaskPlanScores', { taskPlanId: this.id }));
        this.update(data)
    }

    get course() {
        return this.taskPlan.course;
    }
}
