import {
  BaseModel, identifiedBy, field, identifier, hasMany, belongsTo, computed,
} from 'shared/model';
import Exercises from '../../exercises';
import { filter, sumBy, find } from 'lodash';

@identifiedBy('task-plan/scores/student-question')
class TaskPlanScoreStudentQuestion extends BaseModel {
  @identifier id;
  @field exercise_id;
  @field is_completed = false;
  @field points = 0;
  @field selected_answer_id;
  @field free_response;

  @belongsTo({ model: 'task-plan/scores/student' }) student;

  @computed get index() {
    return this.student && this.student.questions.indexOf(this);
  }

  @computed get questionHeading() {
    return this.student.period.question_headings[this.index];
  }

  @computed get availablePoints() {
    return this.questionHeading.points;
  }
}

@identifiedBy('task-plan/scores/student')
class TaskPlanScoreStudent extends BaseModel {
  @identifier id;
  @field first_name;
  @field last_name;
  @field student_identifier;
  @field is_dropped;
  @field is_late;
  @field available_points;
  @field total_points;
  @field total_fraction;
  @field late_work_point_penalty;
  @field late_work_fraction_penalty;

  @hasMany({ model: TaskPlanScoreStudentQuestion, inverseOf: 'student' }) questions;
  @belongsTo({ model: 'task-plan/scores/period' }) period;

  @computed get name() {
    return `${this.last_name}, ${this.first_name}`;
  }
}


@identifiedBy('task-plan/scores/question')
class TaskPlanScoreHeading extends BaseModel {
  @identifier title;
  @field type;
  @field points;
  @computed get index() {
    return this.period && this.period.question_headings.indexOf(this);
  }

  @computed get studentResponses() {
    return this.period.students.map(s => s.questions[this.index]);
  }

  @computed get responseStats() {
    const responses = this.studentResponses;
    return {
      completed: filter(responses, 'is_completed').length,
      hasFreeResponse: Boolean(find(responses, 'free_response')),
      points: sumBy(responses, 'points'),
      totalPoints: this.points * responses.length,
    };
  }
}


@identifiedBy('task-plan/scores/period')
class TaskPlanPeriodScore extends BaseModel {

  @identifier period_id;
  @field name;

  @field({ type: 'object' }) average_score;
  @field({ type: 'object' }) available_points;

  @hasMany({ model: TaskPlanScoreHeading, inverseOf: 'period' }) question_headings;
  @hasMany({ model: TaskPlanScoreStudent, inverseOf: 'period' }) students;

  @computed get coreQuestionHeadings() {
    return filter(this.question_headings, h => h.type != 'Tutor');
  }

  // this returns all of the quesions that were assigned
  // this is trickier than just using the index from headings because tutor assigned questions
  // will be in different order and different students will get different ones
  @computed get questionsInfo() {
    const info = {};
    for (const student of this.students) {
      for (const studentQuestion of student.questions) {
        const exercise = Exercises.get(studentQuestion.exercise_id);
        if (exercise) {
          const question = exercise.content.questions.find(q => q.id == studentQuestion.id);
          const questionInfo = info[question.id] || (info[question.id] = {
            id: question.id,
            key: question.id,
            points: studentQuestion.points,
            exercise,
            question,
            responses: [],
          });
          questionInfo.responses.push(studentQuestion);
        }
      }
    }

    // add their stats once all the questions are gathered
    return Object.values(info).map((qi) => {
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
    });
  }

  @computed get hasEqualTutorQuestions() {
    for (const student of this.students) {
      if (student.questions.length != this.question_headings.length) {
        return false;
      }
    }
    return true;
  }

}

export default
@identifiedBy('task-plan/scores')
class TaskPlanScores extends BaseModel {

  @identifier id;
  @field title;
  @field type;

  @hasMany({ model: TaskPlanPeriodScore, inverseOf: 'plan' }) periods;
  @belongsTo({ model: 'task-plans/teacher/plan' }) taskPlan;
  @belongsTo({ model: 'course' }) course;

  @computed get exerciseIds() {
    const ids = [];
    for (const period of this.periods) {
      for (const student of period.students) {
        for (const question of student.questions) {
          ids.push(question.exercise_id);
        }
      }
    }
    return ids;
  }

  fetch() { return { id: this.id }; }

}
