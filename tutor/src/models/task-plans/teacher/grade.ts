import {
    BaseModel, field, model, modelize, action,
} from 'shared/model';
import { pick } from 'lodash';

import { TeacherTaskPlan } from '../../../models'
import urlFor from '../../../api'

export class TeacherTaskStepGrade extends BaseModel {

    @model(TeacherTaskPlan) taskPlan?: TeacherTaskPlan;

    @field grader_points: number;
    @field grader_comments: string;
    @field response: any

    @field attempt_number = 0;
    @field answer_id?: any;
    @field free_response?: any;
    @field response_validation?: any;
    @field last_graded_at?: any;

    constructor({ response, points, comment }: { response: any, points: number, comment: string }) {
        super();
        modelize(this)
        this.response = response;
        this.grader_points = points;
        this.grader_comments = comment;
    }


    async save() {
        const data = await this.api.request( urlFor('gradeTaskStep', { taskStepId: this.response.task_step_id }), {
            data: pick(this, 'attempt_number', 'grader_points', 'grader_comments'),
        })
        this.onGraded(data)
    }

    @action onGraded(data: any) {
        this.update(data);
        this.response.update(data);
    }

}
