import { action, computed } from 'mobx';
import { map } from 'lodash';
import { Map, ID, getParentOf, field, modelize, hydrateModel } from 'shared/model';
import { PracticeQuestion } from './practice-questions/practice-question';
import urlFor from '../api'
import type { PracticeQuestionData, Course } from '../models'

export class PracticeQuestions extends Map<ID, PracticeQuestion> {
    static Model = PracticeQuestion

    @field current_task_id?: ID;

    constructor() {
        super();
        modelize(this);
    }

    get course() { return getParentOf<Course>(this) }

    async fetch() {
        const questions = await this.api.request(
            urlFor(
                'fetchPracticeQuestions',
                { courseId: this.course.id },
                { role_id: this.course.currentRole.id },
            ))
        this.mergeModelData(questions);
    }

    checkExisting() {
        return { courseId: this.course.id };
    }

    @action onFoundExistingPractice(data: PracticeQuestionData) {
        this.current_task_id = data.id;
    }

    @action onQuestionDeleted(question: PracticeQuestion) {
        this.delete(question.id);
    }

    @computed get isAnyPending() { 
        return Boolean(this.array.find(e => e.api.isPending));
    }

    findByExerciseId(exerciseId: ID) {
        return this.array.find(prc => prc.exercise_id == exerciseId);
    }

    findByUuid(exerciseUuid: ID) {
        return this.array.find(prc => prc.exercise_uuid == exerciseUuid);
    }

    async create(tasked_exercise_id: ID) {
        const question = hydrateModel(PracticeQuestion, {
            tasked_exercise_id: tasked_exercise_id,
        }, this)
        // add the question to the array with a pending key
        // this is to track the state of the request
        this.set('pending', question);
        await question.save();
    }

}
