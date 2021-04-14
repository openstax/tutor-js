import { BaseModel, ID, field, modelize, action, NEW_ID, getParentOf } from 'shared/model';
import urlFor from '../../api'
import type { PracticeQuestionObj, PracticeQuestions as Map } from '../../models'


export class PracticeQuestion extends BaseModel {

    @field id:ID = NEW_ID;
    @field tasked_exercise_id:ID = NEW_ID;
    @field exercise_id:ID = NEW_ID;
    @field available = false;

    get map() {
        return getParentOf<Map>(this)
    }

    get course() {
        return this.map.course
    }

    constructor() {
        super();
        modelize(this);
    }

    async save() {
        const data = await this.api.request<PracticeQuestionObj>(
            urlFor('createPracticeQuestion', { courseId: this.course.id }), {
                data: { tasked_exercise_id: this.tasked_exercise_id },
            }
        )
        this.onSaved(data)
    }

    @action onSaved(data: PracticeQuestionObj) {
        this.update(data);
        if (!this.map.get(this.id)) {
            // delete the pending key, and set the new one with its id and the data
            this.map.delete('pending');
            this.map.set(this.id, this);
        }
    }

    async destroy() {
        await this.api.request(
            urlFor('deletePracticeQuestion', { courseId: this.course.id, practiceQuestionId: this.id }), {
                data: { tasked_exercise_id: this.tasked_exercise_id },
            }
        )
        this.map.delete(this.id);
    }

}
