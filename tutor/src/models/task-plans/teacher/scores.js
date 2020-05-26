import {
  BaseModel, identifiedBy, field, identifier, hasMany, belongsTo, computed,
} from 'shared/model';
import Exercises from '../../exercises';
import { filter, sumBy, find, isNil, compact } from 'lodash';
import DroppedQuestion from './dropped_question';

@identifiedBy('task-plan/scores/student-question')
class TaskPlanScoreStudentQuestion extends BaseModel {
  @identifier question_id;
  @field exercise_id;
  @field is_completed = false;
  @field points = 0;
  @field selected_answer_id;
  @field free_response;
  @field task_step_id;
  @field needs_grading;
  @field grader_points;
  @field grader_comments;

  @belongsTo({ model: 'task-plan/scores/student' }) student;

  @computed get gradedPoints() {
    return isNil(this.grader_points) ? this.points : this.grader_points;
  }

  @computed get gradedComments() {
    return isNil(this.grader_comments) ? this.comments : this.grader_comments;
  }

  @computed get index() {
    return this.student && this.student.questions.indexOf(this);
  }

  @computed get questionHeading() {
    return this.student.tasking.question_headings[this.index];
  }

  @computed get availablePoints() {
    return this.questionHeading.points;
  }

  @computed get isManuallyGraded() {
    return !isNil(this.grader_points);
  }

  @computed get isTrouble() {
    return this.is_completed && this.points <= 0.5;
  }
}

@identifiedBy('task-plan/scores/student')
class TaskPlanScoreStudent extends BaseModel {
  @identifier role_id;
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
  @belongsTo({ model: 'task-plan/scores/tasking' }) tasking;

  @computed get name() {
    return `${this.last_name}, ${this.first_name}`;
  }

  @computed get reversedName() {
    return `${this.first_name} ${this.last_name}`;
  }
}


@identifiedBy('task-plan/scores/question')
class TaskPlanScoreHeading extends BaseModel {
  @identifier title;
  @field exercise_id;
  @field question_id;
  @field type;
  @field points;
  @field points_without_dropping;
  @field ecosystem_id;

  @computed get isCore() {
    return 'Tutor' !== this.type;
  }

  @computed get displayType() {
    return this.type === 'FR' ? 'WRQ' : this.type;
  }

  @computed get index() {
    return this.tasking && this.tasking.question_headings.indexOf(this);
  }

  @computed get studentResponses() {
    return compact(this.tasking.students.map(s => s.questions.find(q => q.question_id == this.question_id)));
  }

  @computed get exercise() {
    return Exercises.get(this.exercise_id);
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

  @computed get responseStats() {
    const responses = this.studentResponses;
    return {
      completed: filter(responses, 'is_completed').length,
      hasFreeResponse: Boolean(find(responses, 'free_response')),
      points: sumBy(responses, 'points'),
      totalPoints: this.points * responses.length,
    };
  }

  @computed get gradedStats() {
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

}

@identifiedBy('task-plan/scores/tasking')
class TaskPlanScoresTasking extends BaseModel {
  @identifier id;
  @field period_id;
  @field period_name;

  @field({ type: 'object' }) average_score;
  @field({ type: 'object' }) available_points;
  @belongsTo({ model: 'task-plan/scores' }) plan;
  @hasMany({ model: TaskPlanScoreHeading, inverseOf: 'tasking', extend: {
    gradable() { return filter(this, h => h.question && h.question.isFreeResonseOnly); },
    core() { return filter(this, h => h.type != 'Tutor'); },
  } }) question_headings;
  @hasMany({ model: TaskPlanScoreStudent, inverseOf: 'tasking' }) students;

  @computed get availablePoints() {
    return sumBy(this.question_headings, 'points');
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
          const question = exercise.content.questions.find(q => q.id == studentQuestion.question_id);
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

  @computed get hasUnPublishedScores() {
    return Boolean(
      find(this.students, student => find(student.questions, question => !isNil(question.grader_points))),
    );
  }
}

export default
@identifiedBy('task-plan/scores')
class TaskPlanScores extends BaseModel {

  @identifier id;
  @field title;
  @field description;
  @field type;
  @field ecosystem_id;

  @belongsTo({ model: 'task-plans/teacher/plan' }) taskPlan;

  @hasMany({ model: DroppedQuestion }) dropped_questions;
  @hasMany({ model: TaskPlanScoresTasking, inverseOf: 'scores', extend: {
    forPeriod(period) { return find(this, { period_id: period.id }); },
  }  }) tasking_plans;
  @field({ model: 'grading/template' }) grading_template;

  @computed get exerciseIds() {
    const ids = [];
    for (const tasking of this.tasking_plans) {
      for (const student of tasking.students) {
        for (const question of student.questions) {
          if (!isNil(question.exercise_id)) {
            ids.push(question.exercise_id);
          }
        }
      }
    }
    return ids;
  }

  async ensureExercisesLoaded() {
    if (this.exerciseIds.length) {
      await Exercises.ensureExercisesLoaded({
        course: this.course, ecosystem_id: this.ecosystem_id, exercise_ids: this.exerciseIds, task_plan_id: this.id,
      });
    }
  }

  @computed get isHomework() {
    return 'homework' == this.type;
  }

  fetch() { return { id: this.id }; }

  get course() {
    return this.taskPlan.course;
  }
}
