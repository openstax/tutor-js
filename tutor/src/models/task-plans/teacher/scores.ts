import {
    BaseModel, ID, field, model, modelize, computed, NEW_ID, getParentOf, array,
} from 'shared/model';
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
    DroppedQuestion, GradingTemplate, CoursePeriod, currentExercises, Exercise
} from '../../../models'
import { GroupType } from '../../../models/student-tasks/step'

export class TaskPlanScoreStudentQuestion extends BaseModel {
    @field question_id?: ID;
    @field exercise_id?: ID;
    @field is_completed = false;
    @field points?: number;
    @field comments = ''
    @field late_work_point_penalty?: number;
    @field selected_answer_id?: ID;
    @field attempt_number?: number;
    @field is_correct = false;
    @field free_response = '';
    @field task_step_id: ID = NEW_ID;
    @field needs_grading = false;
    @field grader_points?: number;
    @field grader_comments = '';
    @field submitted_late = false;

    constructor() {
        super();
        modelize(this);
    }

    get student() { return getParentOf<TaskPlanScoreStudent>(this) }

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
        return this.student.questionHeadings[this.index];
    }

    @computed get droppedQuestion() {
        return this.questionHeading?.droppedQuestions?.find(
            dq => dq.question_id == this.question_id
        ) || null;
    }

    @computed get availablePoints() {
        return get(this.questionHeading, 'points', 1.0);
    }

    // This method is only used in the ResultTooltip that shows up for late work
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

    /*
    * The following methods are used in Assignment Builder, Review and Grader screens
    * since these screens displays grader-assigned points before publishing
    * This is also why we do not simply use "this.points" directly
    */

    // This method does not account for dropped WRQs, callers need to handle it
    @computed get gradedPoints() {
        return isNil(this.grader_points) ? this.points : this.grader_points;
    }

    /**
    * This method mimics the backend to handle gradedPoints taking dropped questions into account
    * If question is dropped with full points but student has not attempted the question yet, show 0
    */
    @computed get gradedPointsWithDropped() {
        if (this.droppedQuestion) {
            return this.droppedQuestion.drop_method == 'zeroed' || !this.is_completed
                ? 0
                : this.availablePoints;
        }
        return this.gradedPoints;
    }

    // This is the Student vs Question score value displayed in the Assignment Review table
    @computed get displayValue() {
        if (this.needs_grading) { return UNGRADED; }

        if (!isNil(this.gradedPointsWithDropped)) {
            return ScoresHelper.formatPoints(this.gradedPointsWithDropped);
        }

        return UNWORKED;
    }
}

export class TaskPlanScoreStudent extends BaseModel {
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

    @model(TaskPlanScoreStudentQuestion) questions: TaskPlanScoreStudentQuestion[] = [];

    get tasking() { return getParentOf<TaskPlanScoresTasking>(this) }

    constructor() {
        super();
        modelize(this);
    }

    /*
    * Looks only at headings whose index is greater than or equal to each question's index
    * Assigns the first one that includes the current question's id in its list of question_ids
    * except that repeats are not allowed
    */
    @computed get questionHeadings() {
        const usedHeadings: TaskPlanScoreHeading[] = [];

        return this.questions.map((question, questionIdx) => {
            const heading = this.tasking.question_headings.slice(questionIdx).find(
                heading => heading.question_ids.includes(question.question_id || 0) &&
                    !usedHeadings.includes(heading)
            )

            if (!heading) { return null; }

            usedHeadings.push(heading);

            return heading;
        });
    }

    resultForHeading(heading: TaskPlanScoreHeading) {
        const index = this.questionHeadings.indexOf(heading);
        if (index < 0) { return null; }
        return this.questions[heading.index];
    }

    @computed get someQuestionsDroppedByInstructor() {
        return this.questions.some(q => q.droppedQuestion);
    }

    @computed get someQuestionsDroppedByAlgorithm() {
        return this.questions.length < this.tasking.question_headings.length;
    }

    @computed get someQuestionsDropped() {
        return this.someQuestionsDroppedByInstructor || this.someQuestionsDroppedByAlgorithm;
    }

    @computed get name() {
        return `${this.last_name}, ${this.first_name}`;
    }

    @computed get reversedName() {
        return `${this.first_name}, ${this.last_name}`;
    }

    @computed get extension() {
        if (isEmpty(this.tasking.scores.taskPlan.extensions)) return null;
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

export class TaskPlanScoreHeading extends BaseModel {
    @field title = NEW_ID;
    @field exercise_ids: ID[] = [];
    @field question_ids: ID[] = [];
    @field type = '';
    @field points = 0;
    @field points_without_dropping = 0;
    @field ecosystem_id = NEW_ID;
    @field group_type: GroupType = GroupType.Unknown;

    exercises = currentExercises

    get tasking() { return getParentOf<TaskPlanScoresTasking>(this) }

    constructor() {
        super();
        modelize(this);
    }

    @computed get isCore() {
        return 'Tutor' !== this.type;
    }

    @computed get isPersonalized() {
        return this.group_type === GroupType.Personalized
    }

    @computed get isSpacedPractice() {
        return this.group_type === GroupType.SpacedPractice
    }

    @computed get index() {
        return this.tasking && this.tasking.question_headings.indexOf(this);
    }

    @computed get studentResponses() {
        return compact(this.tasking.students.map(student => student.resultForHeading(this)));
    }

    /*
    * exercise and question methods don't work with Tutor-selected questions and should only be used
    * in screens where Tutor-selected questions don't show up like the grader screen
    */
    @computed get exercise() {
        if (this.exercise_ids.length != 1) { return null; }

        return this.exercises.get(this.exercise_ids[0]);
    }

    @computed get question() {
        if (this.question_ids.length != 1) { return null; }

        return this.exercise &&
            this.exercise.content.questions.find(q => q.id == this.question_ids[0]);
    }

    @computed get questionIdsSet() {
        return new Set(this.question_ids);
    }

    @computed get droppedQuestions() {
        return this.tasking.scores.dropped_questions.filter(
            dq => this.questionIdsSet.has(dq.question_id)
        );
    }

    @computed get someQuestionsDroppedByInstructor() {
        return this.droppedQuestions.length > 0;
    }

    @computed get someQuestionsDroppedByAlgorithm() {
        return this.tasking.students.some(s => s.questions.length <= this.index);
    }

    @computed get someQuestionsDropped() {
        return this.someQuestionsDroppedByInstructor || this.someQuestionsDroppedByAlgorithm;
    }

    @computed get everyQuestionDropped() {
        // We only have to check if the instructor dropped all questions,
        // because the heading simply wouldn't be present if the algorithm dropped them
        return this.droppedQuestions.length == this.questionIdsSet.size;
    }

    @computed get everyQuestionZeroed() {
        return this.everyQuestionDropped && this.droppedQuestions.every(
            dq => dq.drop_method == 'zeroed'
        );
    }

    @computed get everyQuestionFullCredit() {
        return this.everyQuestionDropped && this.droppedQuestions.every(
            dq => dq.drop_method == 'full_credit'
        );
    }

    @computed get gradedProgress() {
        return `(${this.gradedStats.completed}/${this.gradedStats.total})`;
    }

    @computed get gradedProgressWithUnAttemptedResponses() {
        return `(${this.gradedStatsWithUnAttemptedResponses.completed}/${this.gradedStatsWithUnAttemptedResponses.total})`;
    }

    @computed get gradedStats() {
        // Filter students who have completed the question
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

    /*
    * The following 2 methods are used in Assignment Builder, Review and Grader screens
    * They use gradedPointsWithDropped, since those screens display grader-assigned points
    * before publishing and we decided we do want dropped questions to affect these averages
    */

    @computed get responseStats() {
        const responses = this.studentResponses;
        //don't include students who were dropped
        const responsesInAvgs = filter(
            responses,
            response => !isNil(response.gradedPointsWithDropped) && !response.student.is_dropped
        );
        return {
            completed: filter(responses, 'is_completed').length,
            hasFreeResponse: Boolean(find(responses, 'free_response')),
            availablePoints: this.points,
            correct: filter(responses, 'is_correct').length,
            averageGradedPoints: sumBy(
                responsesInAvgs, 'gradedPointsWithDropped'
            ) / responsesInAvgs.length,
        };
    }

    @computed get averageGradedPoints() {
        return this.responseStats.averageGradedPoints;
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
}

type QuestionInfo = {
    availablePoints: number,
    averagePoints: number,
    completed: number,
    droppedQuestion: DroppedQuestion,
    exercise: Exercise,
    hasFreeResponse: boolean,
    heading: TaskPlanScoreHeading,
    id: ID,
    index: number,
    isCore: boolean,
    isSpacedPractice: boolean,
    key: number,
    points: number,
    question: TaskPlanScoreStudentQuestion,
    remaining: number,
    responses: TaskPlanScoreStudentQuestion[],
    totalPoints: number,
}

export class TaskPlanScoresTasking extends BaseModel {
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

    @model(TaskPlanScoreStudent) students = array((s: TaskPlanScoreStudent[]) => ({
        get active() { return filter(s, { is_dropped: false }) },
    }))

    @computed get availablePoints() {
        return sumBy(this.question_headings, 'points');
    }

    /*
    * This returns all of the questions that were assigned
    * This is trickier than just using the index from headings because tutor assigned questions
    * will be in different order and different students will get different ones
    * This is used in the Assignment Builder, Grader, and
    * Review Details and Submission Overview
    * Seems like the current behavior is to not have dropped questions affect the averagePoints here
    */
    @computed get questionsInfo() {
        const info = {};
        for (const student of this.students) {
            for (const studentQuestion of student.questions) {
                const exercise = studentQuestion.exercise_id && this.exercises.get(studentQuestion.exercise_id);
                if (exercise) {
                    const question = exercise.content.questions?.find(q => q.id == studentQuestion.question_id);
                    if (!question) continue;
                    // while rare, heading will be null if this student received more exercises than others
                    const heading = studentQuestion.questionHeading;
                    const droppedQuestion = heading && heading.droppedQuestions.find(
                        dq => dq.question_id === question.id.toString()
                    )
                    const availablePoints = heading ? (
                        droppedQuestion && droppedQuestion.drop_method == 'zeroed' ?
                            0.0 : heading.points
                    ) : 1.0
                    const questionInfo = info[question.id] || (info[question.id] = {
                        id: question.id,
                        key: question.id,
                        points: studentQuestion.points,
                        availablePoints: availablePoints,
                        averagePoints: heading ? heading.averageGradedPoints : studentQuestion.points,
                        remaining: heading ? heading.gradedStats.remaining : 0,
                        index: studentQuestion.index,
                        isCore: heading?.isCore,
                        isSpacedPractice: heading?.isSpacedPractice,
                        droppedQuestion: droppedQuestion,
                        heading,
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
            } as QuestionInfo;
        }), 'index');
    }

    @computed get coreQuestionsInfo() {
        return this.questionsInfo.filter(q => q.isCore);
    }

    @computed get hasEqualQuestions() {
        return !this.question_headings.some(
            heading => heading.someQuestionsDropped && !heading.everyQuestionDropped
        );
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
        if (completedWrmQuestions.length <= 0) { return false; }
        return every(completedWrmQuestions, q => !q.needs_grading);
    }

    @computed get hasAnyResponses() {
        const wrmQuestions = this.wrmQuestions;
        return some(wrmQuestions, q => q.is_completed);
    }

    @computed get questionsGroupedByPageTopic() {
        // Filter out spaced practice so they can be shown at the end of the QuestionList
        const questions = this.questionsInfo.filter(i => !i.heading.isSpacedPractice);

        //order the questions by the exercise page's chapter_section so that the first chapters are shown first
        const sortedQuestions = orderBy(questions, ['exercise.page.chapter_section.asNumber'], ['asc']);
        return groupBy(sortedQuestions, q => {
            return q.exercise.page.title;
        });
    }

    @computed get spacedPracticeQuestions() {
        return this.questionsInfo.filter(i => i.heading.isSpacedPractice)
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

    @model(DroppedQuestion) dropped_questions: DroppedQuestion[] = []

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
