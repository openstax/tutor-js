import { filter, find } from 'lodash';
import { computed, observable } from 'mobx';
import {
  BaseModel, identifiedBy, field, hasMany, session, identifier,
} from '../base';


@identifiedBy('course/roster/assignment_stat')
class AssignmentStat extends BaseModel {
  @identifier id;
  @session type;
  @session status;
  @session score;
  @session step_count;
  @session completed_step_count;
  @session completed_accepted_late_exercise_count;
  @session completed_accepted_late_step_count;
  @session completed_exercise_count;
  @session completed_on_time_exercise_count;
  @session completed_on_time_step_count;
  @session completed_step_count;
  @session correct_accepted_late_exercise_count
  @session correct_exercise_count
  @session correct_on_time_exercise_count
  @session({ type: 'date' }) due_at;
  @session exercise_count;
  @session is_included_in_averages;
  @session is_late_work_accepted;
  @session recovered_exercise_count;
}


@identifiedBy('course/roster/student')
class Student extends BaseModel {
  @session average_score = 0;
  @hasMany({ model: AssignmentStat }) data;
  @session first_name;
  @session last_name;
  @session is_dropped;
  @session name;
  @session role;
  @session student_identifier;
}


@identifiedBy('course/roster/heading')
class Heading extends BaseModel {
  @session average_score = 0;
  @session completion_rate = 0;
  @session({ type: 'date' }) due_at;
  @session plan_id;
  @session title;
  @session type;
}

@identifiedBy('course/roster/section')
class CourseScoresSection extends BaseModel {

  @hasMany({ model: Heading }) data_headings;
  @session overall_average_score = 0;
  @session period_id;
  @hasMany({ model: Student }) students;

  @computed get courseStudents() {
    return this.course.roster.studentsForPeriod(
      find(this.course.periods, { period_id: this.period_id })
    );
  }

  @computed get numAssignments() {
    return this.data_headings.length;
  }

  constructor(attrs, course) {
    super(attrs);
    this.course = course;
  }
}

@identifiedBy('course/roster')
export default class CourseScores extends BaseModel {

  @observable course;

  @observable periods = observable.map();

  constructor(course) {
    super();
    this.course = course;
  }

  fetch() {
    return { courseId: this.course.id };
  }
  onFetchComplete({ data }) {
    console.log("ON COM", data)
    data.forEach(s => this.periods.set(s.period_id, new CourseScoresSection(s, this.course)));
  }

  getTask(taskId) {
    //
  }

  forPeriod(period) {
    let section = this.periods.get(period.id);
    if (!section) {
      section = new CourseScoresSection({period_id: period.id}, this.course);
//      this.sections.set(period.id, section);
    }
    return section;
  }

}

//
//   import { CrudConfig, makeSimpleStore, extendConfig } from './helpers';
//   import _ from 'underscore';
//
//   import { TimeStore } from './time';
//
//   import TH from '../helpers/task';
//
//   const ACCEPTING = 'accepting';
//   const ACCEPTED = 'accepted';
//
//   const REJECTING = 'rejecting';
//   const REJECTED = 'rejected';
//
//   let TASK_ID_CACHE = {};
//
//   const allStudents = scores =>
//     _.chain(scores)
//      .pluck('students')
//      .flatten(true)
//      .each(student =>
//        // TODO remove when BE fixes role to be string
//        student.role = `${student.role}`
//      )
//      .value()
//   ;
//
//   const computeTaskCache = data =>
//     (() => {
//       const result = [];
//       for (var courseId in data) {
//         var period = data[courseId];
//         result.push((() => {
//           const result1 = [];
//           for (var periodIndex = 0; periodIndex < data[courseId].length; periodIndex++) {
//             period = data[courseId][periodIndex];
//             result1.push((() => {
//               const result2 = [];
//               for (var studentIndex = 0; studentIndex < period.students.length; studentIndex++) {
//                 var student = period.students[studentIndex];
//                 if (student.is_dropped !== true) {
//                   result2.push((() => {
//                     const result3 = [];
//                     for (let task of Array.from(student.data)) {
//                       if (task != null) {
//                         result3.push(TASK_ID_CACHE[task.id] = { task, courseId, period, periodIndex, studentIndex });
//                       }
//                     }
//                     return result3;
//                   })());
//                 }
//               }
//               return result2;
//             })());
//           }
//           return result1;
//         })());
//       }
//       return result;
//     })()
//   ;
//
//   const getTaskInfoById = function(taskId, data) {
//     taskId = parseInt(taskId, 10);
//     if (_.isEmpty(TASK_ID_CACHE)) { computeTaskCache(data); }
//     return TASK_ID_CACHE[taskId];
//   };
//
//
//   const adjustTaskAverages = function(data, taskInfo, columnIndex) {
//     const { task } = taskInfo;
//     const oldScore = task.score;
//     const course = data[taskInfo.courseId][0];
//     let student = course.students[taskInfo.studentIndex];
//
//     // Update score for the task without rounding so the calculations below will use it's full precision
//     task.score =
//       (task.correct_on_time_exercise_count + task.correct_accepted_late_exercise_count ) /
//     task.exercise_count;
//
//     // Student's course average
//     let numTasksStudent = 0;
//     for (var studentTask of Array.from(student.data)) { if ((studentTask != null ? studentTask.is_included_in_averages : undefined)) { numTasksStudent += 1; } }
//
//     student.average_score =
//       ( student.average_score - ( oldScore / numTasksStudent ) ) +
//         ( task.score / numTasksStudent );
//
//     // Assignment averages
//     let numStudentsTask = 0;
//     for (student of Array.from(course.students)) {
//       for (let i = 0; i < student.data.length; i++) {
//         studentTask = student.data[i];
//         if (studentTask) {
//           if (i === columnIndex) {
//             if (studentTask.is_included_in_averages) { numStudentsTask += 1; }
//           }
//         }
//       }
//     }
//
//     const heading = course.data_headings[columnIndex];
//     if (heading.average_score != null) {
//       heading.average_score =
//         ( heading.average_score - ( oldScore / numStudentsTask ) ) +
//           ( task.score / numStudentsTask );
//     }
//
//     // Overall course averages
//     let taskCount = 0;
//     for (student of Array.from(course.students)) {
//       for (studentTask of Array.from(student.data)) { if ((studentTask != null ? studentTask.is_included_in_averages : undefined)) { taskCount += 1; } }
//     }
//
//     course.overall_average_score =
//       (course.overall_average_score - ( oldScore / taskCount ) ) +
//         ( task.score / taskCount );
//
//     // Now round the score
//     return task.score = Math.round(task.score * 100 ) / 100;
//   };
//
//
//   let defaultExport = {};
//   const ScoresConfig = {
//
//     _asyncStatus: {},
//
//     // clear the task id cache on load & reset
//     _loaded(obj) {
//       TASK_ID_CACHE = {};
//       return obj;
//     },
//     _reset() {
//       return TASK_ID_CACHE = {};
//     },
//
//     //#####################################################################
//     //# The accept / reject methods mirror Tutor-Server logic.           ##
//     //# See: app/subsystems/tasks/models/task.rb                         ##
//     //#####################################################################
//
//     acceptLate(taskId, columnIndex) {
//       this._asyncStatus[taskId] = ACCEPTING;
//       const taskInfo = getTaskInfoById(taskId, this._local);
//       const { task } = taskInfo;
//
//       // nothing to do if it's not actually late
//       if (!TH.hasLateWork(task)) { return; }
//
//       task.is_late_work_accepted = true;
//
//       task.completed_accepted_late_exercise_count =
//         task.completed_exercise_count - task.completed_on_time_exercise_count;
//       task.correct_accepted_late_exercise_count =
//         task.correct_exercise_count - task.correct_on_time_exercise_count;
//       task.completed_accepted_late_step_count =
//         task.completed_step_count - task.completed_on_time_step_count;
//
//       task.accepted_late_at = TimeStore.getNow().toISOString();
//
//       if (task.is_included_in_averages) {
//         adjustTaskAverages(this._local, taskInfo, columnIndex);
//       }
//
//       return this.emitChange();
//     },
//
//     acceptedLate(unused, taskId, courseId) {
//       this._asyncStatus[taskId] = ACCEPTED;
//       return this.emitChange();
//     },
//
//     rejectLate(taskId, columnIndex) {
//       this._asyncStatus[taskId] = REJECTING;
//       const taskInfo = getTaskInfoById(taskId, this._local);
//       const { task } = taskInfo;
//       task.is_late_work_accepted = false;
//       task.correct_accepted_late_exercise_count = 0;
//       task.completed_accepted_late_exercise_count = 0;
//       task.completed_accepted_late_step_count = 0;
//       delete task.accepted_late_at;
//
//       if (task.is_included_in_averages) {
//         adjustTaskAverages(this._local, taskInfo, columnIndex);
//       }
//
//       return this.emitChange();
//     },
//
//     rejectedLate(unused, taskId, courseId) {
//       this._asyncStatus[taskId] = REJECTED;
//       return this.emitChange();
//     },
//
//
//     defaultExport: {
//       getEnrolledScoresForPeriod(courseId, periodId) {
//         const data = this._get(courseId);
//         const scores = (periodId != null) ? _.findWhere(data, { period_id: periodId }) : _.first(data);
//         if (scores != null) {
//           scores.students = _.reject(scores.students, 'is_dropped');
//         }
//         return scores;
//       },
//
//       getTaskInfoById(taskId) {
//         return getTaskInfoById(taskId, this._local);
//       },
//
//       getStudent(courseId, roleId) {
//         const students = allStudents(this._get(courseId));
//         return _.findWhere(allStudents(this._get(courseId)), { role: roleId });
//       },
//
//       getAllStudents(courseId) {
//         return allStudents(this._get(courseId));
//       },
//
//       getStudentOfTask(courseId, taskId) {
//         const students = allStudents(this._get(courseId));
//
//         // TODO remove when BE fixed for ids to be strings instead of numbers
//         taskId = parseInt(taskId);
//
//         return _.find(students, function(student) {
//         const taskIds = _.pluck(student.data, 'id');
//         return _.indexOf(taskIds, taskId) > -1;
//       });
//     },
//
//     isUpdatingLateStatus(taskId) {
//       return (this._asyncStatus[taskId] === ACCEPTING) ||
//       (this._asyncStatus[taskId] === REJECTING);
//     },
//   },
//
//
// };
//
// extendConfig(ScoresConfig, new CrudConfig());
// const { actions, store } = makeSimpleStore(ScoresConfig);
// defaultExport = { ScoresActions: actions, ScoresStore: store };
// export default defaultExport;
